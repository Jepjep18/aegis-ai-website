"use client";

import { useAuthStore } from "@/store/auth.store";
import { Sparkles } from "lucide-react";

export default function WelcomeBanner() {
  const { user } = useAuthStore();
  const userName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Engineer";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-sky-950/20 to-[#07111F] p-8 shadow-2xl">
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-medium text-cyan-300 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Interview Copilot Workspace</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Welcome back, <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">{userName}</span>
        </h2>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Ready to prepare for your next technical interview? Upload your resume, add target job descriptions, and generate evidence-backed answers in real time.
        </p>
      </div>
    </div>
  );
}
