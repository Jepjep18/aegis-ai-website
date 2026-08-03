import type { ReactNode } from "react";

import AuthBranding from "./AuthBranding";
import AuthCard from "./AuthCard";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111F]">
      {/* Background Glow */}

      <div className="absolute left-1/3 top-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[160px]" />

      <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1.1fr_.9fr]">

          <AuthBranding />

          <AuthCard>
            {children}
          </AuthCard>

        </div>
      </div>
    </main>
  );
}