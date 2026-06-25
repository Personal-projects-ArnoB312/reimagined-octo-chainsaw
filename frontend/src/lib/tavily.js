const TAVILY_ENDPOINT = "https://api.tavily.com/search";
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Runs a single Tavily search query and returns a normalized list of results.
 * Throws on network/API failure so callers can decide how to handle it.
 */
export async function tavilySearch(query, { maxResults, searchDepth }) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(TAVILY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: searchDepth,
        max_results: maxResults,
        include_answer: false,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Tavily request failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : [];

    return results.map((r) => ({
      title: typeof r.title === "string" ? r.title : "",
      content: typeof r.content === "string" ? r.content : "",
      url: typeof r.url === "string" ? r.url : "",
    }));
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Builds up to `maxQueries` distinct, targeted search queries for a skill.
 * Optionally narrows the query using personal context (e.g. a linked GitHub
 * username or subreddit) so results are more relevant to the user.
 */
export function buildSkillQueries(skill, maxQueries) {
  const base = skill.name.trim();
  const candidates = [
    `${base} latest news and updates`,
    `${base} best practices trends 2026`,
    `${base} ${skill.category ?? ""} this week`.trim(),
  ];

  return candidates.slice(0, Math.max(1, maxQueries)).filter(Boolean);
}
