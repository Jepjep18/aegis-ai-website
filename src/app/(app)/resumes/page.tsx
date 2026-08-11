"use client";

import { useState } from "react";
import AppHeader from "@/components/app/layout/AppHeader";
import ResumeList from "@/components/app/resumes/ResumeList";
import ResumeUploadModal from "@/components/app/resumes/ResumeUploadModal";
import NewInterviewModal from "@/components/app/interviews/NewInterviewModal";
import { useResumes } from "@/hooks/useResumes";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export default function ResumesPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const { resumes, isLoading, deleteResume } = useResumes();

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id);
      toast.success("Resume deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete resume");
    }
  };

  return (
    <>
      <AppHeader onNewInterviewClick={() => setIsInterviewModalOpen(true)} />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Resume Library</h2>
            <p className="text-sm text-slate-400 mt-1">
              Manage uploaded resumes used to provide evidence-backed answers during interview sessions.
            </p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold text-[#051424] hover:opacity-95"
          >
            <Upload className="mr-2 h-4 w-4 stroke-[2.5]" />
            Upload Resume
          </Button>
        </div>

        <ResumeList
          resumes={resumes}
          isLoading={isLoading}
          onDelete={handleDelete}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
      </main>

      <ResumeUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />

      <NewInterviewModal
        open={isInterviewModalOpen}
        onOpenChange={setIsInterviewModalOpen}
      />
    </>
  );
}
