"use client";

import Link from "next/link";
import { useState } from "react";
import AppHeader from "@/components/app/layout/AppHeader";
import WelcomeBanner from "@/components/app/dashboard/WelcomeBanner";
import DashboardStats from "@/components/app/dashboard/DashboardStats";
import QuickActions from "@/components/app/dashboard/QuickActions";
import RecentSessions from "@/components/app/dashboard/RecentSessions";
import ResumeUploadModal from "@/components/app/resumes/ResumeUploadModal";
import NewInterviewModal from "@/components/app/interviews/NewInterviewModal";
import { useResumes } from "@/hooks/useResumes";
import { useInterviews } from "@/hooks/useInterviews";
import { Mic, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const { resumes } = useResumes();
  const { sessions, isLoading: isSessionsLoading } = useInterviews();

  const completedSessions = sessions.filter(
    (s) => s.status?.toLowerCase() === "completed"
  ).length;

  return (
    <>
      <AppHeader onNewInterviewClick={() => setIsInterviewModalOpen(true)} />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
        <WelcomeBanner />

        <DashboardStats
          totalInterviews={sessions.length}
          totalResumes={resumes.length}
          completedSessions={completedSessions}
          creditsRemaining={10 - sessions.length}
        />

        <QuickActions
          onNewInterviewClick={() => setIsInterviewModalOpen(true)}
          onUploadResumeClick={() => setIsResumeModalOpen(true)}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/test/audio"
            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
              <Mic className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Audio Test</p>
              <p className="text-xs text-slate-500 truncate">
                Test mic capture &amp; transcription
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 shrink-0" />
          </Link>
        </div>

        <RecentSessions
          sessions={sessions.slice(0, 5)}
          isLoading={isSessionsLoading}
        />
      </main>

      <ResumeUploadModal
        open={isResumeModalOpen}
        onOpenChange={setIsResumeModalOpen}
      />

      <NewInterviewModal
        open={isInterviewModalOpen}
        onOpenChange={setIsInterviewModalOpen}
      />
    </>
  );
}
