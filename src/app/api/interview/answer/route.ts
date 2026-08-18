import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateGeminiText } from "@/lib/gemini";

interface GenerateAnswerBody {
  question?: string;
  transcript?: string;
  resumeText?: string;
  jdContent?: string;
  position?: string;
  company?: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: GenerateAnswerBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const position = body.position?.trim() || "the role";
  const company = body.company?.trim() || "the company";
  const resumeText = body.resumeText?.trim() || "No resume provided.";
  const jdContent = body.jdContent?.trim() || "No job description provided.";
  const transcript = body.transcript?.trim();

  const systemPrompt = `You are an expert interview coach helping a candidate interviewing for the role of ${position} at ${company}. You craft strong, grounded interview answers that sound natural when spoken aloud (2 minutes max). Always ground claims in the candidate's actual resume experience and tailor them to the job description. Be specific, structured, and confident. Do not invent experience that is not in the resume.`;

  const prompt = `Interviewer question:
"${question}"

Candidate's resume:
${resumeText.slice(0, 6000)}

Job description:
${jdContent.slice(0, 6000)}

${transcript ? `Candidate's rough spoken answer (use it as the starting point, improve it without changing the facts):\n"${transcript}"\n` : ""}

Write the suggested answer. Respond ONLY with a JSON object in this exact shape:
{
  "answer": "the full suggested answer text",
  "keywords": ["3-6 key skills or topics covered"],
  "confidence": 0.85
}
"confidence" is a number between 0 and 1 estimating how well the answer fits the question and the candidate's background.`;

  try {
    const result = await generateGeminiText<{
      answer?: string;
      keywords?: string[];
      confidence?: number;
    }>({ systemPrompt, prompt, json: true, temperature: 0.5 });

    return NextResponse.json({
      answer: result.answer || "",
      keywords: Array.isArray(result.keywords) ? result.keywords : [],
      confidence:
        typeof result.confidence === "number"
          ? Math.min(Math.max(result.confidence, 0), 1)
          : null,
    });
  } catch (error) {
    console.error("Generate answer failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate answer" },
      { status: 500 }
    );
  }
}
