"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Minimal interface for the browser's SpeechRecognition instance. */
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface UseSpeechRecognitionOptions {
  language?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export function useSpeechRecognition({
  language = "en-US",
  onResult,
  onError,
}: UseSpeechRecognitionOptions = {}) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  // Keep refs fresh
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  });

  // Detect Speech API support after hydration (avoids SSR mismatch)
  // useSyncExternalStore returns false during SSR and the real value on the client.
  const supported = useSyncExternalStore(
    () => () => {},
    () =>
      "SpeechRecognition" in window ||
      "webkitSpeechRecognition" in window,
    () => false,
  );

  const start = useCallback(() => {
    if (!supported) {
      onErrorRef.current?.(
        "Speech recognition is not supported in this browser. Use Chrome or Edge."
      );
      return;
    }
    if (isListening) return;

    const Ctor =
      (window as unknown as Record<string, unknown>)["SpeechRecognition"] ??
      (window as unknown as Record<string, unknown>)["webkitSpeechRecognition"];
    const recognition = new (Ctor as new () => SpeechRecognitionInstance)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    let accumulatedFinal = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          accumulatedFinal += transcript;
          setFinalTranscript(accumulatedFinal);
          onResultRef.current?.(accumulatedFinal, true);
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      if (interim) {
        onResultRef.current?.(accumulatedFinal + interim, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Expected non-fatal errors — don't spam the console or stop listening.
      if (
        event.error === "no-speech" ||
        event.error === "aborted" ||
        event.error === "network"
      ) {
        // "network" means Google's speech service is unreachable (expected on
        // localhost without internet or behind strict firewalls). Just warn.
        if (event.error === "network") {
          console.warn("[SpeechRecognition] network error — Google speech service unreachable");
        }
        return;
      }

      console.error("[SpeechRecognition] Error:", event.error);
      onErrorRef.current?.(`Speech recognition error: ${event.error}`);

      // Fatal errors (not-allowed, service-not-allowed, etc.)
      // Stop auto-restart to avoid infinite retry loops.
      recognitionRef.current = null;
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto-restart only if we're still supposed to be listening
      // (recognitionRef.current is set to null on fatal errors above)
      if (recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          // Already started or other issue
        }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
    setInterimTranscript("");
    setFinalTranscript("");
  }, [supported, isListening, language]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Setting ref to null prevents auto-restart in onend
    recognitionRef.current = null;

    try {
      recognition.stop();
    } catch {
      // May already be stopped
    }

    setIsListening(false);
    // Don't clear interimTranscript here — let the consumer read it
    // via finalTranscript + interimTranscript before calling reset().
  }, []);

  const reset = useCallback(() => {
    setInterimTranscript("");
    setFinalTranscript("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;
      if (recognition) {
        recognitionRef.current = null;
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    supported,
    isListening,
    interimTranscript,
    finalTranscript,
    transcript: finalTranscript + interimTranscript,
    start,
    stop,
    reset,
  };
}
