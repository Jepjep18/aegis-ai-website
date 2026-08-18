"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
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

export default function AudioTestPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recordingInfo, setRecordingInfo] = useState<{
    rawSize: number;
    wavSize: number;
    durationSec: number;
  } | null>(null);

  const {
    supported: speechSupported,
    isListening,
    interimTranscript,
    finalTranscript,
    start: startSpeechRecognition,
    stop: stopSpeechRecognition,
    reset: resetSpeechTranscript,
  } = useSpeechRecognition({
    language: "en-US",
    onResult: (text, isFinal) => {
      if (isFinal) {
        log("SPEECH", `Final: ${text.slice(-80)}`, "success");
      } else {
        log("SPEECH", `Interim: ${text.slice(-80)}`, "info");
      }
    },
    onError: (msg) => {
      log("SPEECH", msg, "warn");
    },
  });

  const log = (tag: string, message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { time: formatTime(), tag, message, type }]);
  };

  const {
    supported,
    isRecording,
    start: startRecording,
    stop: stopRecording,
  } = useAudioRecorder({
    onError: (message) => {
      log("ERROR", message, "error");
      toast.error(message);
    },
  });

  const handleStart = async () => {
    setAnswer(null);
    setRecordingInfo(null);
    resetSpeechTranscript();
    log("MIC", "Requesting microphone access…", "info");
    await startRecording();
    log("MIC", "Recording started — play the question now", "success");

    // Start real-time speech recognition
    if (speechSupported) {
      log("SPEECH", "Starting live transcription…", "info");
      startSpeechRecognition();
    } else {
      log("SPEECH", "Speech API not available — Gemini transcription only", "warn");
    }
  };

  const handleStop = async () => {
    log("MIC", "Stopping recording…", "info");

    // Stop real-time speech recognition
    stopSpeechRecognition();
    if (finalTranscript) {
      log("SPEECH", `Live transcript captured: ${finalTranscript.length} chars`, "success");
    }

    const blob = await stopRecording();
    if (!blob) {
      log("MIC", "No audio captured", "error");
      return;
    }

    const rawSize = blob.size;
    log("AUDIO", `Raw blob: ${(rawSize / 1024).toFixed(1)} KB (${blob.type})`, "info");

    // Send the raw WebM/Opus blob directly to Gemini (no WAV conversion needed)
    const mimeType = blob.type || "audio/webm";
    log("API", "Encoding to base64…", "info");
    const base64 = await blobToBase64(blob);
    log("API", `Base64: ${(base64.length * 0.75 / 1024).toFixed(1)} KB (mime: ${mimeType})`, "info");

    setRecordingInfo({ rawSize, wavSize: 0, durationSec: 0 });

    // Send to transcribe
    log("API", "Sending to /api/interview/transcribe…", "info");
    setIsTranscribing(true);
    try {
      const res = await fetch("/api/interview/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64, mimeType }),
      });
      const data = await res.json();

      if (!res.ok) {
        log("API", `Transcribe failed (${res.status}): ${data.error}`, "error");
        return;
      }

      const text = data.text || "";
      log("API", `Transcription received: ${text.length} chars`, "success");
      log("TRANSCRIPT", text || "(empty — no speech detected)", text ? "success" : "warn");
      setQuestion(text);
    } catch (err) {
      log("API", `Request failed: ${err}`, "error");
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

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Audio Test
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Test mic capture, WAV conversion, Gemini transcription, and answer
            generation.
          </p>
        </div>

        {/* Live transcription display */}
        {isListening && (
          <Card className="p-4 border-cyan-400/30 bg-cyan-500/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-semibold text-cyan-300">
                Live Transcription
              </span>
              <Badge variant="default">Listening</Badge>
            </div>
            <div className="min-h-[3rem] rounded-xl bg-black/30 border border-white/5 p-3">
              {finalTranscript && (
                <span className="text-sm text-slate-200 leading-relaxed">
                  {finalTranscript}
                </span>
              )}
              {interimTranscript && (
                <span className="text-sm text-slate-400 italic leading-relaxed">
                  {finalTranscript ? " " : ""}{interimTranscript}
                </span>
              )}
              {!finalTranscript && !interimTranscript && (
                <p className="text-sm text-slate-500">
                  Waiting for speech…
                </p>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {speechSupported
                ? "Transcription powered by browser Speech API — updates live as you speak"
                : "Live transcription not supported in this browser"}
            </p>
          </Card>
        )}

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
                    {isListening
                      ? "Live transcription active — speak now!"
                      : "Play the question on your phone, then stop."}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Click &quot;Start Recording&quot;, play a question on your
                  phone, then click &quot;Stop &amp; Transcribe&quot;.
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Transcribing
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
                  <div className="flex justify-between">
                    <dt className="text-slate-400">WAV size</dt>
                    <dd className="text-slate-200">
                      {(recordingInfo.wavSize / 1024).toFixed(1)} KB
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Duration</dt>
                    <dd className="text-slate-200">
                      ~{recordingInfo.durationSec.toFixed(1)}s
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
