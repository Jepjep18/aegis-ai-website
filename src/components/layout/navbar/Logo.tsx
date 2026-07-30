import Link from "next/link";
import { Shield } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-opacity hover:opacity-90"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/20">
        <Shield className="h-5 w-5 text-primary" />
      </div>

      <div className="leading-tight">
        <h2 className="font-semibold tracking-tight">
          Aegis AI
        </h2>

        <p className="text-xs text-muted-foreground">
          Interview Copilot
        </p>
      </div>
    </Link>
  );
}