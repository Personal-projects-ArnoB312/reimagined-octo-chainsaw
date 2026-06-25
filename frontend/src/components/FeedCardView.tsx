import Link from "next/link";
import type { FeedCard } from "@/lib/types";
import ImpactBadge from "./ImpactBadge";
import { ChevronRight } from "./icons";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export default function FeedCardView({ card }: { card: FeedCard }) {
  return (
    <Link
      href={`/feed/${card.id}`}
      className="block rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-colors active:bg-ink-50"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
          {card.category}
        </span>
        <time className="flex-shrink-0 text-[11px] text-ink-400">
          {formatDate(card.publishedAt)}
        </time>
      </div>

      <h2 className="mt-3 text-base font-semibold leading-snug text-ink-950">
        {card.title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-ink-500">{card.summary}</p>

      <ul className="mt-3 space-y-1.5">
        {card.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink-700">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-300" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-400">{card.source}</span>
          <ImpactBadge impact={card.impact} />
        </div>
        <span className="flex items-center gap-0.5 text-[12px] font-medium text-accent">
          Lees meer
          <ChevronRight />
        </span>
      </div>
    </Link>
  );
}
