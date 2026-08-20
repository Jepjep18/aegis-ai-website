"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { blobToBase64 } from "@/lib/audio";
import AppHeader from "@/components/app/layout/AppHeader";
import {
  Mic,
  Square,
  Loader2,
  AudioLines,
  Trash2,
  Copy,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface LogEntry {
  time: string;
  tag: string;
  message: string;
  type: "info" | "success" | "error" | "warn";
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Send audio to Gemini for transcription and return the text. */
async function transcribeWithGemini(audioBlob: Blob): Promise<string> {
  const mimeType = audioBlob.type || "audio/webm";
  const base64 = await blobToBase64(audioBlob);
  const res = await fetch("/api/interview/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio: base64, mimeType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Transcription failed");
  return data.text || "";
}

export default function AudioTestPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recordingInfo, setRecordingInfo] = useState<{
    rawSize: number;
    durationSec: number;
  } | null>(null);

  // Ref for auto-scrolling the transcription container
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Track whether a Gemini transcription request is in-flight
  const transcribingRef = useRef(false);

  const log = useCallback(
    (tag: string, message: string, type: LogEntry["type"] = "info") => {
      setLogs((prev) => [...prev, { time: formatTime(), tag, message, type }]);
    },
    [],
  );

  // Called every ~3 seconds with accumulated audio during recording
  const handleChunk = useCallback(
    async (blob: Blob) => {
      // Skip if a transcription request is already in-flight
      if (transcribingRef.current) return;
      transcribingRef.current = true;
      try {
        const text = await transcribeWithGemini(blob);
        if (text.trim()) {
          setQuestion(text);
          log("SPEECH", `Live: ${text.slice(-60)}`, "success");
        }
      } catch (err) {
        console.error("[RealtimeTranscribe] chunk error:", err);
        log("SPEECH", `Chunk error: ${err}`, "warn");
      } finally {
        transcribingRef.current = false;
      }
    },
    [log],
  );

  const {
    supported,
    isRecording,
    start: startRecording,
    stop: stopRecording,
  } = useAudioRecorder({
    timeslice: 3000,
    onChunk: handleChunk,
    onError: (message) => {
      log("ERROR", message, "error");
      toast.error(message);
    },
  });

  const handleStart = async () => {
    setAnswer(null);
    setRecordingInfo(null);
    log("MIC", "Requesting microphone access…", "info");

    try {
      await startRecording();
      log("MIC", "Recording started — speak now! (transcription updates every ~3s)", "success");
    } catch (err) {
      log("MIC", `Failed to start: ${err}`, "error");
      toast.error("Microphone access denied");
    }
  };

  const handleStop = async () => {
    log("MIC", "Stopping recording…", "info");

    const blob = await stopRecording();

    if (!blob) {
      log("MIC", "No audio captured", "error");
      return;
    }

    const rawSize = blob.size;
    const durationSec = 0; // Could compute from timestamps if needed
    log("AUDIO", `Raw blob: ${(rawSize / 1024).toFixed(1)} KB (${blob.type})`, "info");
    setRecordingInfo({ rawSize, durationSec });

    // Final transcription for accuracy
    log("SPEECH", "Final transcription…", "info");
    setIsTranscribing(true);
    try {
      const text = await transcribeWithGemini(blob);
      if (text.trim()) {
        log("SPEECH", `Final: ${text}`, "success");
        log("TRANSCRIPT", text, "success");
        setQuestion(text);
      } else {
        log("SPEECH", "No speech detected", "warn");
      }
    } catch (err) {
      log("SPEECH", `Final transcription failed: ${err}`, "error");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateAnswer = async () => {
    if (!question.trim()) return;
    setIsGenerating(true);
    log("API", "Generating answer via /api/interview/answer…", "info");
    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          resumeText: "(test mode — no resume loaded)",
          jdContent: "(test mode — no job description loaded)",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate answer");
      setAnswer(data.answer);
      log("API", `Answer generated (${data.answer.length} chars)`, "success");
    } catch (err) {
      log("API", `Answer generation failed: ${err}`, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearLogs = () => setLogs([]);

  // Auto-scroll transcription container as new text appears
  useEffect(() => {
    const container = transcriptContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [question]);

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Audio Test
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Test mic capture, live transcription via Gemini, and answer generation.
          </p>
        </div>

        {/* Real-time transcription display — always visible */}
        <Card className="p-4 border-cyan-400/30 bg-cyan-500/5">
          <div className="flex items-center gap-2 mb-3">
            {isRecording ? (
              <>
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-300">
                  Live Transcription
                </span>
                <Badge variant="default">Recording</Badge>
              </>
            ) : question ? (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">
                  Transcription Complete
                </span>
                <Badge variant="success">Done</Badge>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-slate-500" />
                <span className="text-sm font-semibold text-slate-400">
                  Real-Time Transcription
                </span>
                <Badge variant="outline">Idle</Badge>
              </>
            )}
          </div>
          <div
            ref={transcriptContainerRef}
            className="min-h-[5rem] max-h-[12rem] overflow-y-auto rounded-xl bg-black/30 border border-white/5 p-4 font-mono text-lg leading-relaxed"
          >
            {question ? (
              <p className="text-slate-200">{question}</p>
            ) : (
              <p className="text-slate-500 text-sm font-sans">
                {isRecording
                  ? "Listening… transcription updates every ~3 seconds"
                  : "Click \"Start Recording\" and speak to see words appear here in real time"}
              </p>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Transcription powered by Gemini — updates every ~3 seconds while recording
          </p>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Controls */}
          <div className="space-y-4">
            {/* Mic status */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Mic className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white">
                  Microphone
                </span>
                {supported ? (
                  <Badge variant="success">Supported</Badge>
                ) : (
                  <Badge variant="destructive">Not supported</Badge>
                )}
              </div>

              {isRecording ? (
                <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-center">
                  <AudioLines className="h-6 w-6 animate-pulse text-rose-300 mx-auto" />
                  <p className="mt-2 text-sm font-medium text-rose-200">
                    Recording…
                  </p>
                  <p className="text-xs text-rose-300/70 mt-1">
                    Transcription updates via Gemini every ~3 seconds
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Click &quot;Start Recording&quot;, speak into the mic,
                  then click &quot;Stop &amp; Transcribe&quot;.
                </p>
              )}

              <div className="flex gap-2 mt-4">
                {isRecording ? (
                  <Button
                    onClick={handleStop}
                    disabled={isTranscribing}
                    className="rounded-xl bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                  >
                    <Square className="mr-2 h-4 w-4" /> Stop &amp; Transcribe
                  </Button>
                ) : (
                  <Button
                    onClick={handleStart}
                    disabled={isTranscribing || isGenerating || !supported}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] font-semibold hover:opacity-95"
                  >
                    <Mic className="mr-2 h-4 w-4" /> Start Recording
                  </Button>
                )}
              </div>

              {isTranscribing && (
                <p className="text-sm text-cyan-400 flex items-center gap-2 mt-3">
                  <Loader2 className="h-4 w-4 animate-spin" /> Final transcription
                  with Gemini…
                </p>
              )}
            </Card>

            {/* Recording info */}
            {recordingInfo && (
              <Card className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Recording Details
                </p>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Raw blob</dt>
                    <dd className="text-slate-200">
                      {(recordingInfo.rawSize / 1024).toFixed(1)} KB
                    </dd>
                  </div>
                </dl>
              </Card>
            )}

            {/* Transcribed question */}
            {question && (
              <Card className="p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Transcribed Question
                </p>
                <Textarea
                  rows={3}
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setAnswer(null);
                  }}
                  className="rounded-xl bg-white/5 border-white/10"
                />
                <Button
                  onClick={handleGenerateAnswer}
                  disabled={isGenerating || !question.trim()}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] font-semibold hover:opacity-95 w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Generating…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Answer
                    </>
                  )}
                </Button>
              </Card>
            )}

            {/* Suggested answer */}
            {answer && (
              <Card className="p-4 space-y-2">
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                  Suggested Answer
                </p>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {answer}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(answer);
                    toast.success("Copied to clipboard");
                  }}
                  className="mt-2"
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy answer
                </Button>
              </Card>
            )}
          </div>

          {/* Right: Logs */}
          <Card className="p-4 flex flex-col" style={{ maxHeight: "80vh" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Logs ({logs.length})
              </p>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearLogs}
                className="text-slate-500 hover:text-white"
                title="Clear logs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-xl bg-black/40 border border-white/5 p-3 font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <p className="text-slate-600">
                  Logs will appear here when you start recording…
                </p>
              ) : (
                logs.map((entry, i) => (
                  <div
                    key={i}
                    className={
                      entry.type === "error"
                        ? "text-rose-400"
                        : entry.type === "success"
                          ? "text-emerald-400"
                          : entry.type === "warn"
                            ? "text-amber-400"
                            : "text-slate-400"
                    }
                  >
                    <span className="text-slate-600">{entry.time}</span>{" "}
                    <span className="text-cyan-500">[{entry.tag}]</span>{" "}
                    {entry.message}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
