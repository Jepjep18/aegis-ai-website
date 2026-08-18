"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

interface UseAudioRecorderOptions {
  onError?: (error: string) => void;
}

export function useAudioRecorder({ onError }: UseAudioRecorderOptions = {}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const supported = useSyncExternalStore(
    () => () => {},
    () => typeof MediaRecorder !== "undefined",
    () => false,
  );
  const [isRecording, setIsRecording] = useState(false);

  const stop = useCallback(async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return null;

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        console.log("[AudioRecorder] Recording stopped:", {
          chunks: chunksRef.current.length,
          blobSize: blob.size,
          blobType: blob.type,
          durationEstimate: recorder.state,
        });
        chunksRef.current = [];
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);
        resolve(blob);
      };
      recorder.stop();
    });
  }, []);

  const start = useCallback(async (): Promise<void> => {
    if (!supported) {
      onError?.("Audio recording is not supported in this browser. Use Chrome or Edge.");
      return;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const tracks = stream.getAudioTracks();
      console.log("[AudioRecorder] Mic access granted:", {
        tracks: tracks.length,
        label: tracks[0]?.label,
        settings: tracks[0]?.getSettings(),
      });

      const mimeType = pickMimeType();
      console.log("[AudioRecorder] Selected MIME type:", mimeType || "(browser default)");

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      let chunkIndex = 0;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          chunkIndex++;
          console.log(`[AudioRecorder] Chunk #${chunkIndex}: ${event.data.size} bytes`);
        }
      };
      recorder.onstart = () => {
        console.log("[AudioRecorder] Recording started, state:", recorder.state);
      };
      recorder.onerror = (event) => {
        console.error("[AudioRecorder] Recorder error:", event);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("[AudioRecorder] Failed to start recording:", err);
      onError?.("Microphone access denied or unavailable. Allow the mic and try again.");
    }
  }, [onError, supported]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { supported, isRecording, start, stop };
}
