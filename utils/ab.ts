"use client";

// Simple A/B assignment using localStorage. Variant is sticky per browser.
export type Variant = "A" | "B";

export function getVariant(experiment: string): Variant {
  if (typeof window === "undefined") return "A";
  try {
    const key = `ab:${experiment}`;
    const existing = localStorage.getItem(key) as Variant | null;
    if (existing === "A" || existing === "B") return existing;
    const variant: Variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(key, variant);
    void logAbEvent(experiment, variant, "assign");
    return variant;
  } catch {
    return "A";
  }
}

export async function logAbEvent(
  experiment: string,
  variant: Variant,
  eventType: "assign" | "view" | "click",
  metadata?: Record<string, any>
) {
  try {
    await fetch("/api/ab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experiment, variant, eventType, metadata }),
    });
  } catch {}
}



















