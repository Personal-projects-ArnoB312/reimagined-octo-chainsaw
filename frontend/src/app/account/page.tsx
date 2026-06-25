"use client";

import { useState } from "react";
import { useLocalStorage, uid } from "@/lib/storage";
import type { LinkedSource, Profile } from "@/lib/types";
import { PlusIcon, TrashIcon } from "@/components/icons";

const EMPTY_PROFILE: Profile = { name: "", email: "", role: "" };

export default function AccountPage() {
  const [profile, setProfile, profileHydrated] = useLocalStorage<Profile>(
    "profile",
    EMPTY_PROFILE
  );
  const [sources, setSources, sourcesHydrated] = useLocalStorage<LinkedSource[]>(
    "sources",
    []
  );
  const [saved, setSaved] = useState(false);
  const [newSourceLabel, setNewSourceLabel] = useState("");
  const [newSourceValue, setNewSourceValue] = useState("");

  function saveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  function addSource() {
    const label = newSourceLabel.trim();
    const value = newSourceValue.trim();
    if (!label || !value) return;
    setSources((prev) => [...prev, { id: uid(), label, value }]);
    setNewSourceLabel("");
    setNewSourceValue("");
  }

  function removeSource(id: string) {
    setSources((prev) => prev.filter((s) => s.id !== id));
  }

  if (!profileHydrated || !sourcesHydrated) return null;

  return (
    <div className="px-4 pt-6">
      <header className="mb-5 px-1">
        <h1 className="text-xl font-semibold tracking-tight text-ink-950">Account</h1>
        <p className="mt-0.5 text-sm text-ink-400">Lokaal profiel en gekoppelde bronnen</p>
      </header>

      <section className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
        <h2 className="text-sm font-semibold text-ink-950">Profiel</h2>

        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-ink-400">Naam</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-ink-100 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-950 outline-none placeholder:text-ink-400 focus:border-accent focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-ink-400">
              E-mail
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="jane@bedrijf.com"
              className="w-full rounded-xl border border-ink-100 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-950 outline-none placeholder:text-ink-400 focus:border-accent focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-ink-400">
              Functie
            </label>
            <input
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              placeholder="Product Designer"
              className="w-full rounded-xl border border-ink-100 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-950 outline-none placeholder:text-ink-400 focus:border-accent focus:bg-white"
            />
          </div>
        </div>

        <button
          onClick={saveProfile}
          className="mt-4 w-full rounded-xl bg-ink-950 py-2.5 text-sm font-semibold text-white transition-opacity active:opacity-80"
        >
          {saved ? "Opgeslagen" : "Profiel opslaan"}
        </button>
      </section>

      <section className="mt-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
        <h2 className="text-sm font-semibold text-ink-950">Gekoppelde bronnen</h2>
        <p className="mt-0.5 text-[12px] text-ink-400">
          Bijv. GitHub username of subreddit
        </p>

        <ul className="mt-3 space-y-2">
          {sources.map((source) => (
            <li
              key={source.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                  {source.label}
                </p>
                <p className="truncate text-sm text-ink-950">{source.value}</p>
              </div>
              <button
                onClick={() => removeSource(source.id)}
                className="flex-shrink-0 rounded-lg p-1.5 text-ink-300 hover:text-red-500"
                aria-label={`Bron ${source.label} verwijderen`}
              >
                <TrashIcon />
              </button>
            </li>
          ))}

          {sources.length === 0 && (
            <li className="py-2 text-sm text-ink-400">Nog geen bronnen gekoppeld.</li>
          )}
        </ul>

        <div className="mt-3 grid grid-cols-[1fr_1.4fr_auto] gap-2">
          <input
            value={newSourceLabel}
            onChange={(e) => setNewSourceLabel(e.target.value)}
            placeholder="Label"
            className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm text-ink-950 outline-none placeholder:text-ink-400 focus:border-accent"
          />
          <input
            value={newSourceValue}
            onChange={(e) => setNewSourceValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSource()}
            placeholder="bv. r/webdev"
            className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm text-ink-950 outline-none placeholder:text-ink-400 focus:border-accent"
          />
          <button
            onClick={addSource}
            className="flex items-center justify-center rounded-xl border border-ink-100 px-3 text-ink-950"
            aria-label="Bron toevoegen"
          >
            <PlusIcon />
          </button>
        </div>
      </section>
    </div>
  );
}
