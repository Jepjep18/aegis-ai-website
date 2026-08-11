"use client";

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
