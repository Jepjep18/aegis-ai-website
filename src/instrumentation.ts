/**
 * Runs once when the Next.js server starts (both `next dev` and `next start`)
 * and prints an environment health check so you can tell at a glance whether
 * the Gemini API key and Supabase env vars are configured and working.
 *
 * The Gemini key is validated with a lightweight models-list request. The key
 * itself is never printed — only a masked suffix.
 */

const globalState = globalThis as unknown as { __aegisStartupCheckDone?: boolean };

function line(ok: boolean, label: string, detail = "") {
  const mark = ok ? "\x1b[32m✔\x1b[0m" : "\x1b[31m✘\x1b[0m";
  console.log(`  ${mark} ${label}${detail ? ` — ${detail}` : ""}`);
}

function maskKey(key: string): string {
  if (key.length <= 8) return "••••";
  return `••••${key.slice(-4)}`;
}

function checkSupabaseEnv() {
  line(
    !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    "Supabase URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "configured"
      : "NEXT_PUBLIC_SUPABASE_URL is missing from .env.local"
  );
  line(
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "Supabase anon key",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "configured"
      : "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local"
  );
}

async function checkGeminiKey() {
  const key = process.env.PUBLIC_GEMINI_API_KEY;
  if (!key) {
    line(false, "Gemini API key", "PUBLIC_GEMINI_API_KEY is not set in .env.local");
    return;
  }

  line(true, "Gemini API key", `configured (${maskKey(key)})`);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(10_000) }
    );
    if (res.ok) {
      line(true, "Gemini API", "reachable — key is valid");
    } else {
      let message = `HTTP ${res.status}`;
      try {
        const data = (await res.json()) as { error?: { message?: string } };
        if (data.error?.message) message = data.error.message;
      } catch {
        // Keep the status-based message if the body isn't JSON.
      }
      line(false, "Gemini API", `key rejected: ${message}`);
    }
  } catch (error) {
    line(
      false,
      "Gemini API",
      `network error: ${error instanceof Error ? error.message : "unknown"}`
    );
  }
}

async function runChecks() {
  console.log("");
  console.log("\x1b[36mAegis AI — environment check\x1b[0m");
  line(
    true,
    "Gemini model",
    process.env.PUBLIC_GEMINI_MODEL || "gemini-2.5-flash (default)"
  );
  checkSupabaseEnv();
  await checkGeminiKey();
  console.log("");
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (globalState.__aegisStartupCheckDone) return;
  globalState.__aegisStartupCheckDone = true;

  // Fire-and-forget so the network check never delays server startup.
  void runChecks();
}
