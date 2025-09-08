'use client'
import { createContext, useContext, useEffect, useReducer } from "react";
import { AuthState, AuthAction, authReducer,InitialAuthState } from "@/reducers/authRreducer";
import { useRouter } from 'next/navigation';

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (user: {
    token: string;
    user: { id: string; email: string; name: string };
  }) => Promise<void>;
 
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, InitialAuthState);

   useEffect(() => {
     const storedUser = localStorage.getItem("user");
     if (storedUser) {
       const { user, token } = JSON.parse(storedUser);
       dispatch({ type: "LOGIN_SUCCESS", payload: { token, user } });
     }
     dispatch({ type: "FINISH_LOADING" });  
   }, []);


  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem("user", JSON.stringify({ user: state.user, token: state.token }));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user, state.token]);



  const login = async (user: { token: string; user: { id: string, email: string, name: string} }) => {

    const { token, user: userData } = user;
     
    dispatch({ type: "LOGIN_SUCCESS", payload: {token, user: userData} });
  };

 

const logout = async () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
};


  return (
    <AuthContext.Provider
      value={{ state, dispatch, login, logout }}
    >
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
