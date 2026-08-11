"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface ResumeEmptyStateProps {
  onUploadClick: () => void;
}

export default function ResumeEmptyState({
  onUploadClick,
}: ResumeEmptyStateProps) {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-400 mb-4">
        <FileText className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-white">No resumes uploaded</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
        Upload your resume PDF so Aegis AI can analyze your experience and generate honest, evidence-backed responses during interviews.
      </p>
      <Button
        onClick={onUploadClick}
        className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] font-semibold hover:opacity-95"
      >
        <Upload className="mr-2 h-4 w-4 stroke-[2.5]" />
        Upload Resume
      </Button>
    </Card>
  );
}
