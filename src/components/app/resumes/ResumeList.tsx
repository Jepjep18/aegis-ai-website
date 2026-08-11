"use client";

import ResumeCard from "./ResumeCard";
import ResumeEmptyState from "./ResumeEmptyState";
import { ResumeRow } from "@/services/resume/resume.repository";

interface ResumeListProps {
  resumes: ResumeRow[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onUploadClick: () => void;
}

export default function ResumeList({
  resumes,
  isLoading,
  onDelete,
  onUploadClick,
}: ResumeListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (resumes.length === 0) {
    return <ResumeEmptyState onUploadClick={onUploadClick} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} onDelete={onDelete} />
      ))}
    </div>
  );
}
