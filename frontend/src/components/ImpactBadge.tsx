import type { FeedImpact } from "@/lib/types";

const STYLES: Record<FeedImpact, { label: string; className: string }> = {
  high: { label: "Hoge impact", className: "bg-accent-light text-accent" },
  medium: { label: "Gemiddelde impact", className: "bg-amber-50 text-amber-600" },
  low: { label: "Lage impact", className: "bg-ink-100 text-ink-400" },
};

export default function ImpactBadge({ impact }: { impact: FeedImpact }) {
  const style = STYLES[impact];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  );
}
