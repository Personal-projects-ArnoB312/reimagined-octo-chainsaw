export type FeedImpact = "high" | "medium" | "low";

export interface FeedCard {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  bullets: string[];
  source: string;
  sourceUrl: string | null;
  impact: FeedImpact;
  publishedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Profile {
  name: string;
  email: string;
  role: string;
}

export interface LinkedSource {
  id: string;
  label: string;
  value: string;
}
