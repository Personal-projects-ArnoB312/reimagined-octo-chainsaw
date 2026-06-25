"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { FeedCard } from "@/lib/types";
import ImpactBadge from "@/components/ImpactBadge";
import { ArrowLeft, ExternalLinkIcon } from "@/components/icons";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default function FeedDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<FeedCard | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feed")
      .then((res) => {
        if (!res.ok) throw new Error("Feed kon niet geladen worden");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const items: FeedCard[] = data.items ?? [];
        const found = items.find((item) => item.id === params.id);
        if (found) {
          setCard(found);
          setStatus("ready");
        } else {
          setStatus("missing");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <div className="px-4 pt-6">
      <button
        onClick={() => router.push("/feed")}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-ink-500"
      >
        <ArrowLeft />
        Terug naar feed
      </button>

      {status === "loading" && (
        <div className="h-64 animate-pulse rounded-2xl border border-ink-100 bg-white" />
      )}

      {(status === "missing" || status === "error") && (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-400">
          {status === "missing"
            ? "Deze update is niet meer beschikbaar."
            : "Kon de update niet laden. Probeer het later opnieuw."}
        </div>
      )}

      {status === "ready" && card && (
        <article className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
              {card.category}
            </span>
            <time className="text-[11px] text-ink-400">{formatDate(card.publishedAt)}</time>
          </div>

          <h1 className="mt-3 text-xl font-semibold leading-snug text-ink-950">
            {card.title}
          </h1>

          <div className="mt-2">
            <ImpactBadge impact={card.impact} />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-700">{card.content}</p>

          <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4">
            {card.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-700">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-300" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
            <span className="text-[11px] text-ink-400">{card.source}</span>
            {card.sourceUrl && (
              <a
                href={card.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[12px] font-medium text-accent"
              >
                Bekijk origineel
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </article>
      )}
    </div>
  );
}
