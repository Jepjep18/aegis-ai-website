import Link from "next/link";
import AuthCard from "@/components/auth/layout/AuthCard";
import AuthHeader from "@/components/auth/shared/AuthHeader";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Check Your Email"
        description="We've sent a verification link to your email address."
      />

      <div className="py-6 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-400">
          <MailCheck className="h-8 w-8" />
        </div>

        <p className="text-sm text-slate-300">
          Please click the link in your email to confirm your account and get started with Aegis AI.
        </p>

        <Button
          asChild
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold text-[#051424] hover:opacity-95 mt-4"
        >
          <Link href="/sign-in">Return to Sign In</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
