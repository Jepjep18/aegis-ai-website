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
  /** If set, MediaRecorder.start() receives this timeslice in ms.
   *  onChunk fires with the accumulated blob on each interval. */
  timeslice?: number;
  /** Called each time the timeslice fires with all accumulated audio. */
  onChunk?: (blob: Blob) => void;
}

export function useAudioRecorder({ onError, timeslice, onChunk }: UseAudioRecorderOptions = {}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const ownsStreamRef = useRef(false);

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
        });
        chunksRef.current = [];

        if (ownsStreamRef.current) {
          streamRef.current?.getTracks().forEach((track) => track.stop());
        }
        streamRef.current = null;
        ownsStreamRef.current = false;
        mediaRecorderRef.current = null;
        setIsRecording(false);
        resolve(blob);
      };
      recorder.stop();
    });
  }, []);

  /**
   * Start recording. If `externalStream` is provided, use it instead of calling getUserMedia.
   * This lets the caller share one mic stream with multiple consumers (e.g. Speech API).
   */
  const start = useCallback(
    async (externalStream?: MediaStream): Promise<void> => {
      if (!supported) {
        onError?.("Audio recording is not supported in this browser. Use Chrome or Edge.");
        return;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") return;

      try {
        let stream: MediaStream;

        if (externalStream) {
          stream = externalStream;
          ownsStreamRef.current = false;
          console.log("[AudioRecorder] Using external shared stream");
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          ownsStreamRef.current = true;
          const tracks = stream.getAudioTracks();
          console.log("[AudioRecorder] Mic access granted:", {
            tracks: tracks.length,
            label: tracks[0]?.label,
          });
        }

        streamRef.current = stream;

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
            // Fire onChunk with accumulated audio
            if (timeslice && onChunk) {
              const accumulated = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
              onChunk(accumulated);
            }
          }
        };
        recorder.onstart = () => {
          console.log("[AudioRecorder] Recording started, state:", recorder.state);
        };
        recorder.onerror = (event) => {
          console.error("[AudioRecorder] Recorder error:", event);
        };
        recorder.start(timeslice ? timeslice : undefined);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.error("[AudioRecorder] Failed to start recording:", err);
        onError?.("Microphone access denied or unavailable. Allow the mic and try again.");
      }
    },
    [onError, supported],
  );

  useEffect(() => {
    return () => {
      if (ownsStreamRef.current) {
        streamRef.current?.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { supported, isRecording, start, stop };
}
