"use client";

import InterviewCard from "./InterviewCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Plus } from "lucide-react";
import { InterviewSessionRow } from "@/services/interview/interview.repository";

interface InterviewListProps {
  sessions: InterviewSessionRow[];
  isLoading: boolean;
  onNewInterviewClick: () => void;
}

export default function InterviewList({
  sessions,
  isLoading,
  onNewInterviewClick,
}: InterviewListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-52 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-400 mb-4">
          <Video className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No interview sessions</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Create an interview session for your target job application. Aegis will combine your resume and job requirements to generate tailored interview answers.
        </p>
        <Button
          onClick={onNewInterviewClick}
          className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] font-semibold hover:opacity-95"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
          Create Interview Session
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <InterviewCard key={session.id} session={session} />
      ))}
    </div>
  );
}
