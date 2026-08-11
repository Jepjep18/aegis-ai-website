"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Trash2, ExternalLink } from "lucide-react";
import { ResumeRow } from "@/services/resume/resume.repository";

interface ResumeCardProps {
  resume: ResumeRow;
  onDelete: (id: string) => void;
}

export default function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const formattedSize = resume.file_size
    ? `${(resume.file_size / 1024 / 1024).toFixed(2)} MB`
    : "PDF";

  const formattedDate = resume.created_at
    ? new Date(resume.created_at).toLocaleDateString()
    : "Recently";

  return (
    <Card className="p-6 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white truncate max-w-[200px]">
              {resume.title}
            </h4>
            <p className="text-xs text-slate-400 truncate max-w-[200px]">
              {resume.file_name}
            </p>
          </div>
        </div>
        <Badge variant="success">Parsed</Badge>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {formattedDate}
        </span>
        <span>{formattedSize}</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {resume.file_url && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 rounded-xl border-white/10 text-slate-300 hover:bg-white/5"
          >
            <a href={resume.file_url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </a>
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(resume.id)}
          className="rounded-xl px-3"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
