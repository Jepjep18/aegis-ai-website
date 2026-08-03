import type { ReactNode } from "react";

import { GlassCard } from "@/components/shared/glass-card";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <GlassCard
      className="
        w-full
        max-w-md
        justify-self-center
        border-white/10
        bg-white/5
        p-8
      "
    >
      {children}
    </GlassCard>
  );
}