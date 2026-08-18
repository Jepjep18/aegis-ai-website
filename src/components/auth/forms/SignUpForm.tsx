"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth/auth.service";
import { toast } from "sonner";

import AuthCard from "../layout/AuthCard";
import AuthHeader from "../shared/AuthHeader";
import AuthDivider from "../shared/AuthDivider";
import PasswordInput from "../shared/PasswordInput";
import SocialLogin from "../shared/SocialLogin";

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authService.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Create Account"
        description="Join Aegis AI to ace your technical interviews."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button
          className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold text-[#051424] hover:opacity-95"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <AuthDivider />

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-cyan-300 hover:text-cyan-200"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
