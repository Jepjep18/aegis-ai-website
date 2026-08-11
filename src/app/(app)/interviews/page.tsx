"use client";

import { useState } from "react";
import AppHeader from "@/components/app/layout/AppHeader";
import InterviewList from "@/components/app/interviews/InterviewList";
import NewInterviewModal from "@/components/app/interviews/NewInterviewModal";
import ResumeUploadModal from "@/components/app/resumes/ResumeUploadModal";
import { useInterviews } from "@/hooks/useInterviews";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InterviewsPage() {
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const { sessions, isLoading } = useInterviews();

  return (
    <>
      <AppHeader onNewInterviewClick={() => setIsInterviewModalOpen(true)} />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Interview Sessions</h2>
            <p className="text-sm text-slate-400 mt-1">
              Active and past interview sessions configured with company job descriptions and candidate experience context.
            </p>
          </div>
          <Button
            onClick={() => setIsInterviewModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold text-[#051424] hover:opacity-95"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
            New Interview
          </Button>
        </div>

        <InterviewList
          sessions={sessions}
          isLoading={isLoading}
          onNewInterviewClick={() => setIsInterviewModalOpen(true)}
        />
      </main>

      <NewInterviewModal
        open={isInterviewModalOpen}
        onOpenChange={setIsInterviewModalOpen}
      />

      <ResumeUploadModal
        open={isResumeModalOpen}
        onOpenChange={setIsResumeModalOpen}
      />
    </>
  );
}
