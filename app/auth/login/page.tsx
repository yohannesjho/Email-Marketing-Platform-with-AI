"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { login, state } = useAuth();
  const { register, handleSubmit } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    await login(data.email, data.password);
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
            <Button type="submit" className="w-full" disabled={state.isLoading}>
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
