"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, ChevronRight, Calendar, Building2 } from "lucide-react";

interface InterviewSessionItem {
  id: string;
  title: string;
  company_name?: string | null;
  status: string;
  created_at: string;
}

interface RecentSessionsProps {
  sessions?: InterviewSessionItem[];
  isLoading?: boolean;
}

export default function RecentSessions({
  sessions = [],
  isLoading = false,
}: RecentSessionsProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "listening":
        return <Badge variant="info">Active</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          Recent Interview Sessions
        </h3>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/interviews" />}
          className="text-cyan-400 hover:text-cyan-300"
        >
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-slate-400">Loading recent sessions...</Card>
      ) : sessions.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400 mb-3">
            <Video className="h-6 w-6" />
          </div>
          <h4 className="text-base font-semibold text-white">No interview sessions yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first interview session to start practicing with real-time AI context generation.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="p-4 flex items-center justify-between transition-colors hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{session.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                    {session.company_name && (
                      <span>• {session.company_name}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(session.status)}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  render={<Link href={`/interviews/${session.id}`} />}
                >
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
