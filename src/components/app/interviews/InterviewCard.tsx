"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, ArrowRight, Building2 } from "lucide-react";
import { InterviewSessionRow } from "@/services/interview/interview.repository";

interface InterviewCardProps {
  session: InterviewSessionRow;
}

export default function InterviewCard({ session }: InterviewCardProps) {
  const formattedDate = session.created_at
    ? new Date(session.created_at).toLocaleDateString()
    : "Recently";

  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "listening":
        return <Badge variant="info">Active</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status || "Preparing"}</Badge>;
    }
  };

  return (
    <Card className="p-6 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.04] flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Building2 className="h-6 w-6" />
          </div>
          {getStatusBadge(session.status)}
        </div>

        <h4 className="mt-4 font-semibold text-lg text-white">
          {session.title}
        </h4>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-cyan-400" />
          <span>Created {formattedDate}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          ID: {session.id.substring(0, 8)}...
        </span>
        <Button
          size="sm"
          render={<Link href={`/interviews/${session.id}`} />}
          className="rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-400 hover:text-[#051424] font-medium"
        >
          Enter Workspace <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
