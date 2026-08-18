/**
 * Server-only Gemini helper. Calls the Gemini REST API directly so we don't
 * add a client dependency. The key stays out of the browser bundle.
 *
 * Uses `PUBLIC_GEMINI_API_KEY` from the environment (see .env.local).
 *
 * Requests are resilient: each call retries with a short backoff and falls
 * back to alternate models when the primary is overloaded (429/503) or
 * unavailable (404).
 */

const GEMINI_API_KEY = process.env.PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = process.env.PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const REQUEST_TIMEOUT_MS = 20_000;
const RETRY_DELAY_MS = 1_000;

/** Ordered model chain: primary first, then fallbacks for overload/unavailable. */
const GEMINI_MODELS = [
  GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-flash-latest",
].filter((model, index, all) => model && all.indexOf(model) === index);

/** Models optimised for audio transcription (ordered best → good). */
const TRANSCRIPTION_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
].filter((model, index, all) => all.indexOf(model) === index);

interface GenerateTextOptions {
  systemPrompt?: string;
  prompt: string;
  /** Ask Gemini to return a JSON object and parse it before returning. */
  json?: boolean;
  temperature?: number;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

class GeminiRequestError extends Error {
  status?: number;
  model?: string;
}

async function requestModel(
  model: string,
  payload: Record<string, unknown>,
  allowEmpty: boolean
): Promise<string> {
  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY!)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (fetchError) {
    const error = new GeminiRequestError(
      `Gemini request to ${model} failed: ${
        fetchError instanceof Error ? fetchError.message : "network error"
      }`
    );
    error.model = model;
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const raw = await response.text();
  if (!response.ok) {
    const error = new GeminiRequestError(
      `Gemini request failed (${response.status}): ${raw.slice(0, 500)}`
    );
    error.status = response.status;
    error.model = model;
    throw error;
  }

  let data: GeminiResponse;
  try {
    data = JSON.parse(raw) as GeminiResponse;
  } catch {
    throw new GeminiRequestError(`Gemini returned an unparseable response from ${model}.`);
  }

  if (data.error?.message) {
    throw new GeminiRequestError(`Gemini request failed: ${data.error.message}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    if (allowEmpty) return "";
    throw new GeminiRequestError(`Gemini returned an empty response from ${model}.`);
  }

  return text;
}

async function callGemini(
  payload: Record<string, unknown>,
  options: { allowEmpty?: boolean } = {}
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "PUBLIC_GEMINI_API_KEY is not set. Add it to .env.local to enable AI features."
    );
  }

  let lastError: GeminiRequestError | null = null;

  for (const model of GEMINI_MODELS) {
    // Try each model up to 2 times (handles transient overload).
    for (let attempt = 0; attempt < 2; attempt++) {
      console.log(`[Gemini] Trying model=${model} attempt=${attempt + 1}/2`);
      try {
        return await requestModel(model, payload, !!options.allowEmpty);
      } catch (error) {
        const requestError = error as GeminiRequestError;
        lastError = requestError;

        // Bad request: payload is the problem, retrying won't help.
        if (requestError.status === 400) throw error;

        // Model doesn't exist / not supported: move to the next model.
        if (requestError.status === 404) break;

        // Transient (429/500/503/network): wait briefly, then retry or fall back.
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new GeminiRequestError("Gemini request failed after retries.");
}

/**
 * Calls Gemini generateContent and returns the generated text (or a parsed
 * JSON value when `json` is true).
 */
export async function generateGeminiText<T = string>(
  options: GenerateTextOptions
): Promise<T> {
  const contents = [{ role: "user", parts: [{ text: options.prompt }] }];
  const generationConfig: Record<string, unknown> = {
    temperature: options.temperature ?? 0.6,
  };
  if (options.json) {
    generationConfig.responseMimeType = "application/json";
  }

  const payload: Record<string, unknown> = { contents, generationConfig };
  if (options.systemPrompt) {
    payload.systemInstruction = { parts: [{ text: options.systemPrompt }] };
  }

  const text = await callGemini(payload);

  if (options.json) {
    return parseJsonFromText(text) as T;
  }

  return text as T;
}

/**
 * Transcribes speech from an audio recording (base64-encoded, e.g. WAV) using
 * Gemini's multimodal audio input.
 */
export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
  console.log("[Gemini] transcribeAudio called:", {
    mimeType,
    audioBase64Length: base64Audio.length,
    estimatedKB: Math.round((base64Audio.length * 0.75) / 1024),
    models: TRANSCRIPTION_MODELS,
  });

  const prompt =
    "Transcribe the attached audio file. Output only the spoken words. " +
    "If the audio is silent or unintelligible, output an empty string.";

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: base64Audio,
            },
          },
        ],
      },
    ],
    generationConfig: { temperature: 0 },
  };

  // Use transcription-optimised model chain.
  let lastError: GeminiRequestError | null = null;
  for (const model of TRANSCRIPTION_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      console.log(`[Gemini] transcribe model=${model} attempt=${attempt + 1}/2`);
      try {
        const result = await requestModel(model, payload, true);
        console.log("[Gemini] transcribeAudio result:", {
          model,
          textLength: result.length,
          preview: result.slice(0, 100) || "(empty)",
        });
        return result;
      } catch (error) {
        lastError = error as GeminiRequestError;
        if (lastError.status === 400) throw error;
        if (lastError.status === 404) break;
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }
  throw lastError ?? new GeminiRequestError("Transcription failed after retries.");
}

/** Extracts a JSON object from Gemini output, tolerating markdown fences. */
function parseJsonFromText(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;

  try {
    return JSON.parse(candidate);
  } catch {
    // Fall back to the first balanced {...} block.
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error("Gemini did not return valid JSON.");
  }
}
