import { NextResponse } from "next/server";
import { getKv } from "@/lib/kv";
import type { FeedCard } from "@/lib/types";
import { APP_CONFIG } from "@/lib/appConfig";

const MOCK_FEED: FeedCard[] = [
  {
    id: "1",
    category: "Work · WordPress",
    title: "WordPress 6.6 verbetert block theme performance",
    summary:
      "De nieuwste WordPress-release verlaagt de laadtijd van block themes door minder render-blocking CSS en een geoptimaliseerde template-hierarchy.",
    bullets: [
      "Render-blocking CSS verminderd met ~30% op standaard block themes",
      "Nieuwe template hierarchy versnelt query's voor custom post types",
      "Backwards compatible met bestaande classic themes",
    ],
    source: "Via Google Search",
    publishedAt: "2026-06-24T09:00:00.000Z",
  },
  {
    id: "2",
    category: "Work · WordPress",
    title: "Plugin-conflicten blijven grootste oorzaak van downtime",
    summary:
      "Een analyse van 4.000 supporttickets toont dat plugin-conflicten verantwoordelijk zijn voor bijna de helft van alle gemelde site-uitval.",
    bullets: [
      "47% van de incidenten komt door incompatibele pluginversies",
      "Staging-omgevingen verlagen incidenten met 60%",
      "Automatische update-rollback wordt vaker ingebouwd door hosts",
    ],
    source: "Via Reddit",
    publishedAt: "2026-06-23T14:30:00.000Z",
  },
  {
    id: "3",
    category: "Personal · React",
    title: "React Server Components winnen terrein in productie",
    summary:
      "Steeds meer teams migreren client-heavy dashboards naar React Server Components om bundle size en time-to-interactive te verlagen.",
    bullets: [
      "Gemiddelde bundle-reductie van 35% gerapporteerd door early adopters",
      "Streaming SSR verbetert perceived performance op mobiel",
      "Tooling rond caching blijft de grootste leercurve",
    ],
    source: "Via GitHub Trending",
    publishedAt: "2026-06-22T08:15:00.000Z",
  },
];

export async function GET() {
  try {
    const stored = (await getKv().get(APP_CONFIG.kv.feedKey)) as FeedCard[] | null;
    if (Array.isArray(stored) && stored.length > 0) {
      return NextResponse.json({ items: stored });
    }
  } catch (error) {
    console.error("[feed] Failed to read feed from Vercel KV, falling back to mock data", error);
  }

  return NextResponse.json({ items: MOCK_FEED });
}
