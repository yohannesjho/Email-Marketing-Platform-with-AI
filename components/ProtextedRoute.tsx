"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
 

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();

  useEffect(() => {
    if (!state.isLoading && !state.user) {
      window.location.href = "/auth/login";
    }
  }, [state.isLoading, state.user]);

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!state.user) {
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    return null;
  }


  return <>{children}</>;
};

export default ProtectedRoute;
