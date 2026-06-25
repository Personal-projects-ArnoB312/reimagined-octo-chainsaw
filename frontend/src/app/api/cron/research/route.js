import { NextResponse } from "next/server";
import { getKv } from "@/lib/kv";
import { APP_CONFIG } from "@/lib/appConfig";
import { tavilySearch, buildSkillQueries } from "@/lib/tavily";
import { summarizeSkillWithClaude } from "@/lib/anthropicClient";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function isValidSkill(skill) {
  return (
    skill &&
    typeof skill === "object" &&
    typeof skill.name === "string" &&
    skill.name.trim().length > 0
  );
}

/**
 * Runs every Tavily query for a skill, merges the results, then asks
 * Claude to turn them into a single feed card. Returns null instead of
 * throwing so one failing skill never aborts the whole cron run.
 */
async function researchSkill(skill, account) {
  const { maxSearchQueriesPerSkill, tavilyMaxResultsPerQuery, tavilySearchDepth } =
    APP_CONFIG.research;

  const queries = buildSkillQueries(skill, maxSearchQueriesPerSkill);

  const resultBatches = await Promise.allSettled(
    queries.map((query) =>
      tavilySearch(query, {
        maxResults: tavilyMaxResultsPerQuery,
        searchDepth: tavilySearchDepth,
      })
    )
  );

  const searchResults = resultBatches
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  const failedQueries = resultBatches.filter((r) => r.status === "rejected");
  if (failedQueries.length > 0) {
    console.error(
      `[research] ${failedQueries.length}/${queries.length} Tavily queries failed for skill "${skill.name}"`,
      failedQueries.map((r) => r.reason?.message)
    );
  }

  if (searchResults.length === 0) {
    throw new Error(`No search results available for skill "${skill.name}"`);
  }

  const card = await summarizeSkillWithClaude(skill, searchResults, {
    model: APP_CONFIG.anthropic.model,
    maxTokens: APP_CONFIG.anthropic.maxTokens,
  });

  return {
    id: uid(),
    category: skill.category ? `${skill.category} · ${skill.name}` : skill.name,
    title: card.title,
    summary: card.summary,
    bullets: card.bullets,
    source: card.source,
    publishedAt: new Date().toISOString(),
    accountId: account?.id ?? null,
  };
}

export async function POST(request) {
  if (!process.env.TAVILY_API_KEY || !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: missing TAVILY_API_KEY or ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const skills = Array.isArray(body?.skills) ? body.skills.filter(isValidSkill) : [];
  const account = body?.account ?? null;

  if (skills.length === 0) {
    return NextResponse.json(
      { error: "Request body must include a non-empty array of active skills" },
      { status: 400 }
    );
  }

  const settled = await Promise.allSettled(
    skills.map((skill) => researchSkill(skill, account))
  );

  const cards = [];
  const errors = [];

  settled.forEach((result, index) => {
    const skillName = skills[index].name;
    if (result.status === "fulfilled") {
      cards.push(result.value);
    } else {
      console.error(`[research] Failed to research skill "${skillName}"`, result.reason);
      errors.push({ skill: skillName, message: result.reason?.message ?? "Unknown error" });
    }
  });

  if (cards.length > 0) {
    try {
      await getKv().set(APP_CONFIG.kv.feedKey, cards);
    } catch (error) {
      console.error("[research] Failed to write feed to Vercel KV", error);
      return NextResponse.json(
        { error: "Research succeeded but storing the feed failed", details: errors },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    generated: cards.length,
    failed: errors.length,
    errors,
  });
}
