import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transcribeAudio } from "@/lib/gemini";

interface TranscribeBody {
  audio?: string;
  mimeType?: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: TranscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const audio = typeof body.audio === "string" ? body.audio.trim() : "";
  if (!audio) {
    return NextResponse.json({ error: "Audio is required" }, { status: 400 });
  }

  try {
    console.log("[Transcribe] Received audio:", {
      audioBase64Length: audio.length,
      estimatedKB: Math.round((audio.length * 0.75) / 1024),
      mimeType: body.mimeType || "audio/wav",
    });
    const text = await transcribeAudio(audio, body.mimeType || "audio/wav");
    console.log("[Transcribe] Gemini responded:", {
      textLength: text.length,
      preview: text.slice(0, 150) || "(empty)",
    });
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[Transcribe] Failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
