import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div
      className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        p-8
        shadow-[0_30px_80px_rgba(0,0,0,.35)]
        backdrop-blur-2xl
      "
    >
      {children}
    </div>
  );
}