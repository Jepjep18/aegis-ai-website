"use client";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import AuthCard from "../layout/AuthCard";
import AuthHeader from "../shared/AuthHeader";
import AuthDivider from "../shared/AuthDivider";
import PasswordInput from "../shared/PasswordInput";
import SocialLogin from "../shared/SocialLogin";

export default function SignInForm() {
  return (
    <AuthCard>
      <AuthHeader
        title="Welcome Back"
        description="Sign in to continue your interview preparation."
      />

      <form className="space-y-5">
        <div className="space-y-2">
          <Label>Email</Label>

          <Input
            type="email"
            placeholder="john@example.com"
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Password</Label>

            <Link
              href="/forgot-password"
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              Forgot Password?
            </Link>
          </div>

          <PasswordInput placeholder="••••••••" />
        </div>

        <Button
          className="h-12 w-full rounded-xl"
          type="submit"
        >
          Sign In
        </Button>
      </form>

      <AuthDivider />

      <SocialLogin />

      <p className="mt-8 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-cyan-300 hover:text-cyan-200"
        >
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}