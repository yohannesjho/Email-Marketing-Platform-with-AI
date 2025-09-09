"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { dispatch, login, state } = useAuth();
  const { register, handleSubmit } = useForm<FormData>();

  const router = useRouter();

  async function onSubmit(data: FormData) {
    dispatch({ type: "LOGIN_REQUEST" });
    
    try {
      const res = await fetch(
        `/api/auth/login`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email: data.email, password: data.password }),
        }
      );
      if (!res.ok) {
        throw new Error("Login failed");
      }
      const user = await res.json();
      

      dispatch({ type: "LOGIN_SUCCESS", payload: user });

      login(user)

      router.push("/dashboard");
     
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: "Login failed" });
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
            />
            <Input
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
            <Button type="submit" className="w-full cursor-pointer" disabled={state.isLoading}>
              {state.isLoading ? "Logging in..." : "Login"}
            </Button>
            {state.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
