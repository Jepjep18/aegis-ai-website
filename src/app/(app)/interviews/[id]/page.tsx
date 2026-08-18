"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/app/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { interviewService } from "@/services/interview/interview.service";
import { jobDescriptionService } from "@/services/job-description/jd.service";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Calendar,
  FileText,
  Mic,
  Sparkles,
  MessageSquare,
  AudioLines,
} from "lucide-react";

function getStatusBadge(status: string | null) {
  switch (status?.toLowerCase()) {
    case "active":
    case "listening":
      return <Badge variant="info">Active</Badge>;
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status || "Preparing"}</Badge>;
  }
}

export default function InterviewWorkspacePage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id;

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["interview-session", sessionId],
    queryFn: () => interviewService.getSession(sessionId),
    enabled: !!sessionId,
  });

  const { data: jobDescription } = useQuery({
    queryKey: ["interview-jd", session?.job_description_id],
    queryFn: () =>
      session?.job_description_id
        ? jobDescriptionService.getJobDescriptionById(
            session.job_description_id
          )
        : null,
    enabled: !!session?.job_description_id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["interview-messages", sessionId],
    queryFn: () => interviewService.getSessionMessages(sessionId),
    enabled: !!sessionId,
  });

  if (sessionLoading) {
    return (
      <>
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            <AudioLines className="mr-2 h-4 w-4 animate-pulse text-cyan-400" />
            Loading interview workspace...
          </div>
        </main>
      </>
    );
  }

  if (!session) {
    notFound();
  }

  return (
    <>
      <AppHeader />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* Session header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href="/interviews" />}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {session.title}
              </h2>
              {getStatusBadge(session.status)}
            </div>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Created{" "}
              {session.created_at
                ? new Date(session.created_at).toLocaleDateString()
                : "Recently"}
              {session.started_at && (
                <span>
                  · Started {new Date(session.started_at).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: Live transcript */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-white font-semibold border-b border-white/5 pb-3">
                <Mic className="h-5 w-5 text-cyan-400" />
                <span>Live Transcript</span>
              </div>

              {messagesLoading ? (
                <p className="text-sm text-slate-400 py-8 text-center">
                  Loading transcript...
                </p>
              ) : messages.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400 mb-3">
                    <AudioLines className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    No questions yet
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Interviewer questions and your answers will appear here in
                    real time. Live audio capture is a planned milestone.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">
                            {message.question || "Interviewer"}
                          </p>
                          {message.answer && (
                            <p className="text-sm text-slate-300 mt-1.5 rounded-xl bg-white/[0.03] border border-white/5 p-3">
                              {message.answer}
                            </p>
                          )}
                          {typeof message.confidence === "number" && (
                            <p className="text-xs text-cyan-400 mt-1.5">
                              Confidence: {Math.round(message.confidence * 100)}%
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right column: AI Copilot + Session context */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-white font-semibold border-b border-white/5 pb-3">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <span>AI Copilot</span>
              </div>
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Answer suggestions on standby
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Once live transcription lands, Aegis will generate grounded
                  answers using your resume evidence here.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 text-white font-semibold border-b border-white/5 pb-3">
                <Briefcase className="h-5 w-5 text-cyan-400" />
                <span>Session Context</span>
              </div>

              <dl className="space-y-3 pt-4 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">
                      Company
                    </dt>
                    <dd className="text-slate-200 mt-0.5">
                      {jobDescription?.company_name || "—"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">
                      Position
                    </dt>
                    <dd className="text-slate-200 mt-0.5">
                      {jobDescription?.position || "—"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500 uppercase tracking-wide">
                      Job Description
                    </dt>
                    <dd className="text-slate-300 mt-0.5 text-xs leading-relaxed line-clamp-6 whitespace-pre-wrap">
                      {jobDescription?.content || "No job description stored."}
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
