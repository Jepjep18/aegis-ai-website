"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import AppHeader from "@/components/app/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import InterviewTimer from "@/components/app/interviews/InterviewTimer";
import { interviewService } from "@/services/interview/interview.service";
import { jobDescriptionService } from "@/services/job-description/jd.service";
import { resumeService } from "@/services/resume/resume.service";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { blobToBase64, blobToWav } from "@/lib/audio";
import { speak, stopSpeaking } from "@/lib/speech";
import { getSessionDurationMinutes, resolvePlan } from "@/lib/config/interview.config";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
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
  Play,
  Volume2,
  RefreshCw,
  Loader2,
  Lightbulb,
  Timer,
  CheckCircle2,
  Square,
  TriangleAlert,
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
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const plan = resolvePlan(user?.user_metadata?.plan as "free" | "premium" | undefined);
  const planDurationMinutes = getSessionDurationMinutes(plan);

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [suggestedAnswer, setSuggestedAnswer] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const savedForQuestionRef = useRef<string | null>(null);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["interview-session", sessionId],
    queryFn: () => interviewService.getSession(sessionId),
    enabled: !!sessionId,
  });

  const { data: jobDescription } = useQuery({
    queryKey: ["interview-jd", session?.job_description_id],
    queryFn: () =>
      session?.job_description_id
        ? jobDescriptionService.getJobDescriptionById(session.job_description_id)
        : null,
    enabled: !!session?.job_description_id,
  });

  const { data: resume } = useQuery({
    queryKey: ["interview-resume", session?.resume_id],
    queryFn: () => (session?.resume_id ? resumeService.getResumeById(session.resume_id) : null),
    enabled: !!session?.resume_id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["interview-messages", sessionId],
    queryFn: () => interviewService.getSessionMessages(sessionId),
    enabled: !!sessionId,
  });

  const [micPermission, setMicPermission] = useState<"unknown" | "granted" | "denied">("unknown");

  const {
    supported: micSupported,
    isRecording,
    start: startRecording,
    stop: stopRecording,
  } = useAudioRecorder({
    onError: (message) => toast.error(message),
  });

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const statusKey = session?.status?.toLowerCase() || "";
  const isActive = ["active", "listening", "thinking", "generating"].includes(statusKey);
  const isCompleted = statusKey === "completed";

  const handleStartListening = async () => {
    if (micPermission !== "granted") {
      const granted = await requestMicPermission();
      if (!granted) {
        toast.warning("Microphone access denied. Type the question instead.");
        return;
      }
    }
    await startRecording();
  };

  const handleStopListening = async () => {
    const blob = await stopRecording();
    if (!blob) return;

    setIsTranscribing(true);
    try {
      const wav = await blobToWav(blob);
      const base64 = await blobToBase64(wav);
      const res = await fetch("/api/interview/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64, mimeType: "audio/wav" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to transcribe question");
      setCurrentQuestion(data.text || "");
      setSuggestedAnswer(null);
      setKeywords([]);
      setConfidence(null);
      toast.success("Question transcribed — review it, then generate your answer.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to transcribe question");
    } finally {
      setIsTranscribing(false);
    }
  };

  const saveQuestionOnly = async () => {
    if (!currentQuestion || savedForQuestionRef.current === currentQuestion) return;
    try {
      await interviewService.saveMessage({
        session_id: sessionId,
        role: "interviewer",
        question: currentQuestion,
      });
      savedForQuestionRef.current = currentQuestion;
      await queryClient.invalidateQueries({ queryKey: ["interview-messages", sessionId] });
    } catch (err) {
      console.error("Failed to save question:", err);
    }
  };

  const requestMicPermission = async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicPermission("denied");
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission("granted");
      return true;
    } catch {
      setMicPermission("denied");
      return false;
    }
  };

  const handleBegin = async () => {
    if (!session) return;
    setIsStarting(true);
    try {
      if (micSupported) {
        const granted = await requestMicPermission();
        if (granted) {
          toast.success("Microphone ready — speak your answers aloud.");
        } else {
          toast.warning("Microphone access denied. You can still type your answers.");
        }
      }
      await interviewService.activateSession(session.id);
      await queryClient.invalidateQueries({ queryKey: ["interview-session", sessionId] });
      toast.success("Interview started — good luck!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start interview");
    } finally {
      setIsStarting(false);
    }
  };

  const handleNextQuestion = async () => {
    await saveQuestionOnly();
    setCurrentQuestion("");
    setSuggestedAnswer(null);
    setKeywords([]);
    setConfidence(null);
  };

  const handleListen = () => {
    if (!currentQuestion) return;
    if (!speak(currentQuestion)) {
      toast.error("Text-to-speech is not supported in this browser.");
    }
  };

  const handleGenerateAnswer = async () => {
    if (!currentQuestion.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          resumeText: resume?.parsed_text || resume?.file_name || "",
          jdContent: jobDescription?.content || "",
          position: jobDescription?.position,
          company: jobDescription?.company_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate answer");

      setSuggestedAnswer(data.answer);
      setKeywords(data.keywords || []);
      setConfidence(data.confidence ?? null);

      await interviewService.saveMessage({
        session_id: sessionId,
        role: "interviewer",
        question: currentQuestion,
        answer: data.answer,
        confidence: data.confidence ?? null,
        keywords: data.keywords || [],
      });
      savedForQuestionRef.current = currentQuestion;
      await queryClient.invalidateQueries({ queryKey: ["interview-messages", sessionId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate answer");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTimerExpire = async () => {
    if (!session) return;
    try {
      await interviewService.completeSession(session.id);
      await queryClient.invalidateQueries({ queryKey: ["interview-session", sessionId] });
      toast.info("Session time is up — interview completed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to end session");
    }
  };

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

  const sessionDurationMinutes = session.duration_minutes ?? planDurationMinutes;

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
              <Badge variant="outline" className="gap-1.5">
                <Timer className="h-3 w-3" />
                {sessionDurationMinutes} min session
              </Badge>
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

        {/* Live Interview */}
        <Card className="p-6">
          <div className="flex items-center gap-2 text-white font-semibold border-b border-white/5 pb-3">
            <Mic className="h-5 w-5 text-cyan-400" />
            <span>Live Interview</span>
          </div>

          {!isActive && !isCompleted ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 mb-4">
                <Mic className="h-7 w-7" />
              </div>
              <h4 className="text-lg font-semibold text-white">
                Ready for your {sessionDurationMinutes}-minute interview
              </h4>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                When you begin, Aegis will request microphone access. Play the
                interviewer question on your phone — the app captures it and
                transcribes it, then generates a suggested answer grounded in
                your resume and the job description.
              </p>
              <Button
                onClick={handleBegin}
                disabled={isStarting}
                className="mt-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] font-semibold hover:opacity-95 px-6 h-11"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Begin Interview
                  </>
                )}
              </Button>
            </div>
          ) : isCompleted ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="text-lg font-semibold text-white">
                Session completed
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                The full question and answer transcript is below.
              </p>
            </div>
          ) : (
            <div className="space-y-5 pt-4">
              {/* Interviewer question */}
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    Interviewer question
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleListen}
                    title="Read the question aloud"
                    disabled={!currentQuestion.trim() || isRecording || isTranscribing}
                    className="text-slate-400 hover:text-cyan-300"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>

                {isRecording ? (
                  <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-center">
                    <AudioLines className="h-6 w-6 animate-pulse text-rose-300 mx-auto" />
                    <p className="mt-2 text-sm font-medium text-rose-200">
                      Listening for the question…
                    </p>
                    <p className="text-xs text-rose-300/70 mt-1">
                      Play the interviewer question now, then press Stop and Transcribe.
                    </p>
                  </div>
                ) : isTranscribing ? (
                  <p className="text-sm text-slate-400 flex items-center gap-2 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                    Transcribing the question with Gemini…
                  </p>
                ) : (
                  <Textarea
                    rows={3}
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Play the question and tap 'Listen to Question', or type it here…"
                    className="rounded-xl bg-white/5 border-white/10"
                  />
                )}
              </div>

              {/* Mic status */}
              <div className="flex items-center gap-2 text-xs">
                {micSupported && micPermission === "granted" && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mic ready
                  </span>
                )}
                {micSupported && micPermission === "denied" && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <TriangleAlert className="h-3.5 w-3.5" /> Mic blocked — type the question instead
                  </span>
                )}
                {!micSupported && (
                  <span className="text-amber-400">
                    Mic capture not supported here — type the question instead (Chrome/Edge recommended).
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {isRecording ? (
                  <Button
                    onClick={handleStopListening}
                    className="rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 h-11 px-5"
                  >
                    <Square className="mr-2 h-4 w-4" /> Stop & Transcribe
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartListening}
                    disabled={isTranscribing || !micSupported}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] font-semibold hover:opacity-95 h-11 px-5"
                  >
                    <Mic className="mr-2 h-4 w-4" /> Listen to Question
                  </Button>
                )}
                <Button
                  onClick={() => {
                    void handleGenerateAnswer();
                  }}
                  disabled={
                    isGenerating || isTranscribing || isRecording || !currentQuestion.trim()
                  }
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] font-semibold hover:opacity-95 h-11 px-5"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Answer
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  disabled={isRecording || isTranscribing}
                  className="rounded-xl h-11"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Next Question
                </Button>
              </div>

              {/* Suggested answer */}
              {suggestedAnswer && (
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/[0.06] p-4 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
                    <Lightbulb className="h-4 w-4" />
                    Suggested Answer
                    {typeof confidence === "number" && (
                      <span className="text-xs font-medium text-slate-400">
                        · {Math.round(confidence * 100)}% match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {suggestedAnswer}
                  </p>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {keywords.map((keyword) => (
                        <Badge key={keyword} variant="info">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: Live transcript */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-white font-semibold border-b border-white/5 pb-3">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
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
                    Interviewer questions and your generated answers will appear
                    here in real time.
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
                            <p className="text-sm text-slate-300 mt-1.5 rounded-xl bg-white/[0.03] border border-white/5 p-3 whitespace-pre-wrap">
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

          {/* Right column: Timer + Session context */}
          <div className="space-y-6">
            <InterviewTimer
              startedAt={session.started_at}
              durationMinutes={sessionDurationMinutes}
              status={session.status}
              onExpire={handleTimerExpire}
            />

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
