"use client";

import { useState } from "react";
import { useLocalStorage, uid } from "@/lib/storage";
import type { Category } from "@/lib/types";
import Toggle from "@/components/Toggle";
import { PlusIcon, TrashIcon, ChevronDown } from "@/components/icons";

const SEED: Category[] = [
  {
    id: uid(),
    name: "Work",
    skills: [
      { id: uid(), name: "WordPress", active: true },
      { id: uid(), name: "SEO", active: false },
    ],
  },
];

export default function SkillsPage() {
  const [categories, setCategories, hydrated] = useLocalStorage<Category[]>(
    "categories",
    SEED
  );
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string>>(new Set());
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillNameByCategory, setNewSkillNameByCategory] = useState<
    Record<string, string>
  >({});

  function toggleOpen(id: string) {
    setOpenCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    setCategories((prev) => [...prev, { id: uid(), name, skills: [] }]);
    setNewCategoryName("");
  }

  function removeCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function addSkill(categoryId: string) {
    const name = (newSkillNameByCategory[categoryId] ?? "").trim();
    if (!name) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, skills: [...c.skills, { id: uid(), name, active: true }] }
          : c
      )
    );
    setNewSkillNameByCategory((prev) => ({ ...prev, [categoryId]: "" }));
  }

  function removeSkill(categoryId: string, skillId: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) }
          : c
      )
    );
  }

  function toggleSkill(categoryId: string, skillId: string) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              skills: c.skills.map((s) =>
                s.id === skillId ? { ...s, active: !s.active } : s
              ),
            }
          : c
      )
    );
  }

  if (!hydrated) return null;

  return (
    <div className="px-4 pt-6">
      <header className="mb-5 px-1">
        <h1 className="text-xl font-semibold tracking-tight text-ink-950">
          Skill Manager
        </h1>
        <p className="mt-0.5 text-sm text-ink-400">
          Beheer categorieën en activeer research per skill
        </p>
      </header>

      <div className="mb-4 flex gap-2">
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="Nieuwe categorie"
          className="flex-1 rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none placeholder:text-ink-400 focus:border-accent"
        />
        <button
          onClick={addCategory}
          className="flex items-center justify-center rounded-xl bg-ink-950 px-3.5 text-white"
          aria-label="Categorie toevoegen"
        >
          <PlusIcon />
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const open = openCategoryIds.has(category.id);
          return (
            <div
              key={category.id}
              className="rounded-2xl border border-ink-100 bg-white shadow-card"
            >
              <div className="flex items-center gap-2 px-4 py-3.5">
                <button
                  onClick={() => toggleOpen(category.id)}
                  className="flex flex-1 items-center justify-between text-left"
                >
                  <span className="text-sm font-semibold text-ink-950">
                    {category.name}
                  </span>
                  <span className="flex items-center gap-2 text-ink-400">
                    <span className="text-[11px]">{category.skills.length}</span>
                    <ChevronDown open={open} />
                  </span>
                </button>
                <button
                  onClick={() => removeCategory(category.id)}
                  className="ml-1 rounded-lg p-1.5 text-ink-300 hover:text-red-500"
                  aria-label={`Categorie ${category.name} verwijderen`}
                >
                  <TrashIcon />
                </button>
              </div>

              {open && (
                <div className="border-t border-ink-100 px-4 py-3">
                  {category.skills.length === 0 && (
                    <p className="py-2 text-sm text-ink-400">
                      Nog geen skills in deze categorie.
                    </p>
                  )}

                  <ul className="space-y-2">
                    {category.skills.map((skill) => (
                      <li
                        key={skill.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-3 py-2.5"
                      >
                        <span className="text-sm text-ink-950">{skill.name}</span>
                        <div className="flex items-center gap-3">
                          <Toggle
                            checked={skill.active}
                            onChange={() => toggleSkill(category.id, skill.id)}
                            label={`Research voor ${skill.name}`}
                          />
                          <button
                            onClick={() => removeSkill(category.id, skill.id)}
                            className="rounded-lg p-1 text-ink-300 hover:text-red-500"
                            aria-label={`Skill ${skill.name} verwijderen`}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex gap-2">
                    <input
                      value={newSkillNameByCategory[category.id] ?? ""}
                      onChange={(e) =>
                        setNewSkillNameByCategory((prev) => ({
                          ...prev,
                          [category.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addSkill(category.id)}
                      placeholder="Nieuwe skill"
                      className="flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm text-ink-950 outline-none placeholder:text-ink-400 focus:border-accent"
                    />
                    <button
                      onClick={() => addSkill(category.id)}
                      className="flex items-center justify-center rounded-xl border border-ink-100 px-3 text-ink-950"
                      aria-label="Skill toevoegen"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="rounded-2xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-400">
            Voeg een categorie toe om te starten.
          </div>
        )}
      </div>
    </div>
  );
}
