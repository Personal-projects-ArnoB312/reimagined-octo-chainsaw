import type { Category, LinkedSource, Profile } from "./types";

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Reads categories/skills/profile/sources straight from localStorage and
 * builds the payload the cron research route expects: only active skills,
 * plus account context used to judge how relevant an update is.
 */
export function buildResearchPayload() {
  const categories = readLocal<Category[]>("categories", []);
  const profile = readLocal<Profile>("profile", { name: "", email: "", role: "" });
  const sources = readLocal<LinkedSource[]>("sources", []);

  const skills = categories.flatMap((category) =>
    category.skills
      .filter((skill) => skill.active)
      .map((skill) => ({ name: skill.name, category: category.name }))
  );

  const account = {
    name: profile.name || null,
    role: profile.role || null,
    sources: sources.map((s) => ({ label: s.label, value: s.value })),
  };

  return { skills, account };
}
