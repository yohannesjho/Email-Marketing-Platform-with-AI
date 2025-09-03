"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state, dispatch } = useAuth();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false); // track localStorage check

  // Load user from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    }
    setInitialized(true); // finished checking
  }, [dispatch]);

  // Redirect only after initialization
  useEffect(() => {
    if (initialized && !state.user && !state.isLoading) {
      router.push("/auth/login");
    }
  }, [initialized, state.user, state.isLoading, router]);

  if (!initialized || !state.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
