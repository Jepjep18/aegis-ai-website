import type { ReactNode } from "react";

import AuthBranding from "./AuthBranding";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: Props) {
  return (
    <div className="relative flex min-h-screen bg-[#07111F]">
      {/* Left Side */}

      <AuthBranding />

      {/* Right Side */}

      <main className="flex flex-1 items-center justify-center p-6 lg:p-12">
        {children}
      </main>
    </div>
  );
}