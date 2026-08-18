#!/usr/bin/env node
/**
 * Validates the Gemini API key on demand.
 *
 *   npm run check:api
 *
 * Loads PUBLIC_GEMINI_API_KEY from .env.local (or the environment) and pings
 * the Gemini API to confirm the key is valid. Never prints the key itself.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvVar(name) {
  if (process.env[name]) return process.env[name];

  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && match[1] === name) {
        return match[2].replace(/^["']|["']$/g, "");
      }
    }
  }
  return undefined;
}

const key = loadEnvVar("PUBLIC_GEMINI_API_KEY");

if (!key) {
  console.error("✘ PUBLIC_GEMINI_API_KEY is not set in .env.local");
  process.exit(1);
}

console.log(`Checking Gemini API key (••••${key.slice(-4)})…`);

try {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
    { signal: AbortSignal.timeout(15_000) }
  );

  if (res.ok) {
    const data = await res.json();
    console.log(
      `✔ Gemini API key is valid (${data.models?.length ?? 0} models available)`
    );
    process.exit(0);
  }

  let message = `HTTP ${res.status}`;
  try {
    const data = await res.json();
    message = data?.error?.message || message;
  } catch {
    // Keep the status-based message if the body isn't JSON.
  }
  console.error(`✘ Gemini API rejected the key: ${message}`);
  process.exit(1);
} catch (error) {
  console.error(
    `✘ Could not reach the Gemini API: ${error instanceof Error ? error.message : "unknown error"}`
  );
  process.exit(1);
}
