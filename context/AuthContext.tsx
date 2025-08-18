import { createContext, useReducer } from "react";
import { AuthState, AuthAction, authReducer,InitialAuthState } from "@/reducers/authRreducer";

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, InitialAuthState);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Login failed");
      }
      const user = await res.json();
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: "Login failed" });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const user = await res.json();

      if (!res.ok) {
        throw new Error(user.error || "Register failed");
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: "Registration failed" });
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("api/auth/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
