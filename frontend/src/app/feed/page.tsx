"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeedCard } from "@/lib/types";
import FeedCardView from "@/components/FeedCardView";
import { RefreshIcon } from "@/components/icons";
import { buildResearchPayload } from "@/lib/researchPayload";
import { useLocalStorage } from "@/lib/storage";

type FeedFilter = "important" | "all";

export default function FeedPage() {
  const [items, setItems] = useState<FeedCard[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [filter, setFilter, filterHydrated] = useLocalStorage<FeedFilter>(
    "feedFilter",
    "important"
  );

  const loadFeed = useCallback(() => {
    setStatus("loading");
    return fetch("/api/feed")
      .then((res) => {
        if (!res.ok) throw new Error("Feed kon niet geladen worden");
        return res.json();
      })
      .then((data) => {
        setItems(data.items ?? []);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  async function runResearchNow() {
    setRefreshing(true);
    setRefreshError(null);

    try {
      const payload = buildResearchPayload();
      if (payload.skills.length === 0) {
        setRefreshError("Activeer eerst een skill in de Skill Manager.");
        return;
      }

      const res = await fetch("/api/cron/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Research-run is mislukt");
      }

      await loadFeed();
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : "Research-run is mislukt");
    } finally {
      setRefreshing(false);
    }
  }

  const visibleItems = items.filter((item) =>
    filter === "all" ? true : item.impact !== "low"
  );

  return (
    <div className="px-4 pt-6">
      <header className="mb-4 flex items-start justify-between gap-3 px-1">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink-950">Feed</h1>
          <p className="mt-0.5 text-sm text-ink-400">Research op basis van jouw actieve skills</p>
        </div>
        <button
          onClick={runResearchNow}
          disabled={refreshing}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-2 text-[12px] font-medium text-ink-700 shadow-card disabled:opacity-60"
        >
          <RefreshIcon spinning={refreshing} />
          {refreshing ? "Research loopt…" : "Refresh"}
        </button>
      </header>

      {refreshError && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {refreshError}
        </div>
      )}

      {filterHydrated && (
        <div className="mb-4 flex gap-1.5 px-1">
          <button
            onClick={() => setFilter("important")}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              filter === "important"
                ? "bg-ink-950 text-white"
                : "bg-white text-ink-500 border border-ink-100"
            }`}
          >
            Belangrijk
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              filter === "all"
                ? "bg-ink-950 text-white"
                : "bg-white text-ink-500 border border-ink-100"
            }`}
          >
            Alles
          </button>
        </div>
      )}

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

      {status === "ready" && visibleItems.length === 0 && (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-400">
          {items.length === 0
            ? "Nog geen updates. Activeer skills in de Skill Manager en druk op Refresh."
            : "Geen belangrijke updates. Bekijk \"Alles\" voor de rest."}
        </div>
      )}

      {status === "ready" && visibleItems.length > 0 && (
        <div className="space-y-3">
          {visibleItems.map((card) => (
            <FeedCardView key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
