export type Plan = "free" | "premium";

/**
 * Session timeframes (in minutes) per plan tier.
 * Adjust these values to change how long each interview session lasts.
 */
export const SESSION_DURATIONS: Record<Plan, number> = {
  free: 10,
  premium: 30,
};

/**
 * Default plan tier applied when a user has no explicit plan.
 * This is the "config flag" for now — once billing/subscriptions are wired
 * up, derive the plan from the user's subscription instead.
 */
export const DEFAULT_PLAN: Plan = "free";

/**
 * Resolve a user's plan tier.
 * Currently reads an optional `plan` in the auth user's metadata (so you can
 * test premium without billing) and falls back to `DEFAULT_PLAN`.
 */
export function resolvePlan(plan?: Plan | null): Plan {
  if (plan === "premium") return "premium";
  return DEFAULT_PLAN;
}

export function getSessionDurationMinutes(plan: Plan | null | undefined): number {
  return SESSION_DURATIONS[resolvePlan(plan)];
}
