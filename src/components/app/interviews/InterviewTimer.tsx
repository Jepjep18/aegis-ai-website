"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterviewTimerProps {
  startedAt: string | null;
  durationMinutes: number | null;
  status: string | null;
  onExpire: () => void;
}

function formatRemaining(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.max(totalSeconds % 60, 0);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const ACTIVE_STATUSES = ["active", "listening", "thinking", "generating"];

export default function InterviewTimer({
  startedAt,
  durationMinutes,
  status,
  onExpire,
}: InterviewTimerProps) {
  const minutes = durationMinutes ?? 10;
  const totalMs = minutes * 60 * 1000;

  const [now, setNow] = useState(() => Date.now());
  const firedRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const statusKey = status?.toLowerCase() || "";
  const active = ACTIVE_STATUSES.includes(statusKey);
  const completed = statusKey === "completed";

  useEffect(() => {
    if (!active || !startedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active, startedAt]);

  const startMs = startedAt ? new Date(startedAt).getTime() : now;
  const remainingMs = startMs + totalMs - now;
  const remainingSeconds = Math.max(Math.ceil(remainingMs / 1000), 0);
  const elapsedRatio = completed
    ? 1
    : Math.min(Math.max((totalMs - remainingMs) / totalMs, 0), 1);

  useEffect(() => {
    if (active && startedAt && remainingSeconds <= 0 && !firedRef.current) {
      firedRef.current = true;
      onExpireRef.current();
    }
  }, [active, startedAt, remainingSeconds]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 text-white font-semibold border-b border-white/5 pb-3">
        <Timer className={cn("h-5 w-5 text-cyan-400", active && "animate-pulse")} />
        <span>Session Timer</span>
        <span className="ml-auto font-mono text-lg tabular-nums tracking-wide">
          {completed ? "00:00" : formatRemaining(remainingSeconds)}
        </span>
      </div>

      <div className="pt-4">
        <Progress value={elapsedRatio * 100} max={100} />
        <p className="text-xs text-slate-500 mt-2">
          {completed
            ? "This session has ended."
            : active
              ? `${minutes} minute session · time remaining`
              : `${minutes} minute session · starts when you begin the interview`}
        </p>
      </div>
    </Card>
  );
}
