'use client'
import { createContext, useContext, useReducer } from "react";
import { AuthState, AuthAction, authReducer,InitialAuthState } from "@/reducers/authRreducer";
import { useRouter } from 'next/navigation';

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, InitialAuthState);

  const router = useRouter();

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_REQUEST" });
    
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
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
      router.push("/dashboard");
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: "Login failed" });
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      
      const res = await fetch("/api/auth/register", {
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
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      dispatch({ type: "LOGOUT" });
    } catch(error) {
       dispatch({ type: "LOGIN_FAILURE", payload: "Registration failed" });
      
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, dispatch, login, registerUser, logout }}
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
