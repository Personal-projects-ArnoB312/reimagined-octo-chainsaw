import { NextResponse } from "next/server";
import { kvGet } from "@/lib/kv";
import type { FeedCard } from "@/lib/types";
import { APP_CONFIG } from "@/lib/appConfig";

export const dynamic = "force-dynamic";

const MOCK_FEED: FeedCard[] = [
  {
    id: "1",
    category: "Work · WordPress",
    title: "WordPress 6.6 verbetert block theme performance",
    summary:
      "De nieuwste WordPress-release verlaagt de laadtijd van block themes door minder render-blocking CSS en een geoptimaliseerde template-hierarchy.",
    content:
      "WordPress 6.6 introduceert een herziene template-hierarchy die de hoeveelheid render-blocking CSS op standaard block themes met ongeveer 30% terugbrengt. Dit is vooral merkbaar op content-zware pagina's met veel custom post types, waar queries voorheen vertraging opleverden. De update is volledig backwards compatible, dus bestaande classic themes blijven werken zonder aanpassingen. Voor wie veel met block themes werkt is dit een directe en meetbare performance-winst zonder extra configuratie.",
    bullets: [
      "Render-blocking CSS verminderd met ~30% op standaard block themes",
      "Nieuwe template hierarchy versnelt query's voor custom post types",
      "Backwards compatible met bestaande classic themes",
    ],
    source: "Via Google Search",
    sourceUrl: "https://wordpress.org/news/",
    impact: "high",
    publishedAt: "2026-06-24T09:00:00.000Z",
  },
  {
    id: "2",
    category: "Work · WordPress",
    title: "Plugin-conflicten blijven grootste oorzaak van downtime",
    summary:
      "Een analyse van 4.000 supporttickets toont dat plugin-conflicten verantwoordelijk zijn voor bijna de helft van alle gemelde site-uitval.",
    content:
      "Uit een analyse van 4.000 supporttickets blijkt dat 47% van alle gemelde downtime wordt veroorzaakt door incompatibele pluginversies, vaak na een automatische update. Teams die een staging-omgeving gebruiken voordat ze updates naar productie pushen, zien een afname van incidenten met 60%. Daarnaast bouwen steeds meer hostingpartijen automatische rollback-functionaliteit in, zodat een mislukte update binnen enkele minuten kan worden teruggedraaid in plaats van handmatig herstel te vereisen.",
    bullets: [
      "47% van de incidenten komt door incompatibele pluginversies",
      "Staging-omgevingen verlagen incidenten met 60%",
      "Automatische update-rollback wordt vaker ingebouwd door hosts",
    ],
    source: "Via Reddit",
    sourceUrl: "https://www.reddit.com/r/Wordpress/",
    impact: "high",
    publishedAt: "2026-06-23T14:30:00.000Z",
  },
  {
    id: "3",
    category: "Personal · React",
    title: "React Server Components winnen terrein in productie",
    summary:
      "Steeds meer teams migreren client-heavy dashboards naar React Server Components om bundle size en time-to-interactive te verlagen.",
    content:
      "Early adopters die client-heavy dashboards hebben gemigreerd naar React Server Components rapporteren een gemiddelde bundle-reductie van 35%. Streaming SSR verbetert daarbij de perceived performance op mobiel aanzienlijk, omdat gebruikers eerder content zien terwijl de rest van de pagina nog laadt. De grootste uitdaging blijft de tooling rond caching: veel teams onderschatten hoeveel tijd het kost om caching-strategieën goed af te stemmen op server- en client-componenten samen.",
    bullets: [
      "Gemiddelde bundle-reductie van 35% gerapporteerd door early adopters",
      "Streaming SSR verbetert perceived performance op mobiel",
      "Tooling rond caching blijft de grootste leercurve",
    ],
    source: "Via GitHub Trending",
    sourceUrl: "https://github.com/trending",
    impact: "medium",
    publishedAt: "2026-06-22T08:15:00.000Z",
  },
];

export async function GET() {
  try {
    const stored = (await kvGet(APP_CONFIG.kv.feedKey)) as FeedCard[] | null;
    if (Array.isArray(stored) && stored.length > 0) {
      return NextResponse.json({ items: stored });
    }
  } catch (error) {
    console.error("[feed] Failed to read feed from Vercel KV, falling back to mock data", error);
  }

  return NextResponse.json({ items: MOCK_FEED });
}
