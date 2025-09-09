"use client";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  AuthState,
  AuthAction,
  authReducer,
  InitialAuthState,
} from "@/reducers/authRreducer";

type SummDataType = {
  emails: number;
  scheduledEmails: number;
  contacts: number;
  templates: number;
};

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (user: {
    token: string;
    user: { id: string; email: string; name: string };
  }) => Promise<void>;
  logout: () => void;
  summData: SummDataType;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, InitialAuthState);
  const [summData, setSummData] = useState<SummDataType>({
    emails: 0,
    scheduledEmails: 0,
    contacts: 0,
    templates: 0,
  });

  // ---- Helper: fetch summary data ----
  const fetchSummData = async (token: string) => {
    try {
      const res = await fetch("/api/summData", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch summary data:", res.status, errorText);
        if (res.status === 401) {
          logout();  
        }
        return;
      }

      const data = await res.json();
      setSummData(data);
    } catch (err) {
      console.error("Error fetching summary data:", err);
    }
  };


  // ---- On mount: restore from localStorage ----
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { user, token } = JSON.parse(storedUser);
      dispatch({ type: "LOGIN_SUCCESS", payload: { token, user } });
      fetchSummData(token).finally(() => {
        dispatch({ type: "FINISH_LOADING" });
      });
    } else {
      dispatch({ type: "FINISH_LOADING" });
    }
  }, []);

  // ---- Keep localStorage in sync ----
  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem(
        "user",
        JSON.stringify({ user: state.user, token: state.token })
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user, state.token]);

  // ---- Login ----
  const login = async (user: {
    token: string;
    user: { id: string; email: string; name: string };
  }) => {
    const { token, user: userData } = user;
    dispatch({ type: "LOGIN_SUCCESS", payload: { token, user: userData } });
    await fetchSummData(token);
  };

  // ---- Logout ----
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    setSummData({ emails: 0, scheduledEmails: 0, contacts: 0, templates: 0 });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, summData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
