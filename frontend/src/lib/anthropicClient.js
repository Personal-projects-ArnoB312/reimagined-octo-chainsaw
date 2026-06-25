const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const REQUEST_TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT =
  "Je bent een professionele research-assistent. Vat de updates over deze skill " +
  "samen in een zakelijke, beknopte toon. Genereer exact 1 heldere kaart per skill " +
  "in JSON-formaat (met title, summary, content, 3 bullets, source en impact). " +
  "Beoordeel 'impact' kritisch: alleen updates die direct relevant zijn voor de " +
  "dagelijkse workflow van de gebruiker krijgen 'high', algemeen interessante maar " +
  "niet direct toepasbare updates 'medium', en achtergrondnieuws zonder directe " +
  "actie 'low'. Antwoord uitsluitend met geldige JSON, zonder markdown-codeblok en " +
  "zonder extra tekst.";

function buildUserPrompt(skill, searchResults, account) {
  const sourcesBlock = searchResults
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}\nURL: ${r.url}`)
    .join("\n\n");

  const accountContext = account?.role
    ? `Functie van de gebruiker: ${account.role} (gebruik dit om de impact op hun workflow in te schatten)`
    : null;

  return [
    `Skill: ${skill.name}`,
    skill.category ? `Categorie: ${skill.category}` : null,
    accountContext,
    "",
    "Zoekresultaten:",
    sourcesBlock || "(geen zoekresultaten gevonden)",
    "",
    "Geef je antwoord als JSON-object met exact deze velden:",
    '{ "title": string, "summary": string, "content": string, "bullets": [string, string, string], "source": string, "impact": "high" | "medium" | "low" }',
    '"summary" is 1-2 zinnen voor in een kaartoverzicht. "content" is een uitgebreidere ' +
      "tekst van 3-5 zinnen voor wie wil doorlezen. " +
      '"source" moet kort en leesbaar zijn, bv. "Via Tavily Search".',
  ]
    .filter(Boolean)
    .join("\n");
}

function extractJson(rawText) {
  const trimmed = rawText.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch ? fencedMatch[1] : trimmed;
  return JSON.parse(candidate);
}

/**
 * Sends the search results for a single skill to Claude and returns one
 * parsed feed card. Throws if the API call fails or the response isn't
 * valid JSON matching the expected shape.
 */
export async function summarizeSkillWithClaude(
  skill,
  searchResults,
  { model, maxTokens, account }
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(ANTHROPIC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(skill, searchResults, account) }],
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic request failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const rawText = data?.content?.[0]?.text;
  if (typeof rawText !== "string") {
    throw new Error("Anthropic response did not contain text content");
  }

  let parsed;
  try {
    parsed = extractJson(rawText);
  } catch {
    throw new Error("Anthropic response was not valid JSON");
  }

  if (
    typeof parsed.title !== "string" ||
    typeof parsed.summary !== "string" ||
    typeof parsed.content !== "string" ||
    !Array.isArray(parsed.bullets) ||
    parsed.bullets.length !== 3 ||
    !parsed.bullets.every((b) => typeof b === "string") ||
    typeof parsed.source !== "string" ||
    !["high", "medium", "low"].includes(parsed.impact)
  ) {
    throw new Error("Anthropic response JSON did not match the expected card shape");
  }

  return {
    title: parsed.title,
    summary: parsed.summary,
    content: parsed.content,
    bullets: parsed.bullets,
    source: parsed.source,
    impact: parsed.impact,
  };
}
