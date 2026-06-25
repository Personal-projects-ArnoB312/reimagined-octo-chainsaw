"use client";

import { useEffect, useState } from "react";
import type { FeedCard } from "@/lib/types";
import FeedCardView from "@/components/FeedCardView";

export default function FeedPage() {
  const [items, setItems] = useState<FeedCard[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feed")
      .then((res) => {
        if (!res.ok) throw new Error("Feed kon niet geladen worden");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-4 pt-6">
      <header className="mb-5 px-1">
        <h1 className="text-xl font-semibold tracking-tight text-ink-950">Feed</h1>
        <p className="mt-0.5 text-sm text-ink-400">Research op basis van jouw actieve skills</p>
      </header>

      {status === "loading" && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-ink-100 bg-white"
            />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-400">
          Feed kon niet geladen worden. Probeer het later opnieuw.
        </div>
      )}

      {status === "ready" && items.length === 0 && (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-400">
          Nog geen updates. Activeer skills in de Skill Manager.
        </div>
      )}

      {status === "ready" && items.length > 0 && (
        <div className="space-y-3">
          {items.map((card) => (
            <FeedCardView key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
