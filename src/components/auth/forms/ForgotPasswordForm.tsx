"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth/auth.service";
import { toast } from "sonner";

import AuthCard from "../layout/AuthCard";
import AuthHeader from "../shared/AuthHeader";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authService.resetPassword(email);
      if (error) {
        toast.error(error.message);
      } else {
        setSubmitted(true);
        toast.success("Password reset instructions sent to your email.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Reset Password"
        description="Enter your registered email to receive password reset instructions."
      />

      {submitted ? (
        <div className="space-y-6 text-center py-4">
          <p className="text-sm text-slate-300">
            Check your inbox for <span className="font-semibold text-white">{email}</span>. Follow the link inside to reset your password.
          </p>
          <Button
            asChild
            className="w-full rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/sign-in">Return to Sign In</Link>
          </Button>
        </div>
      ) : (
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

          <Button
            className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold text-[#051424] hover:opacity-95"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending link..." : "Send Reset Link"}
          </Button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Remembered your password?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-cyan-300 hover:text-cyan-200"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
