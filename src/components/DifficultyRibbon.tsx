import { Difficulty, difficultyLabel } from "@/lib/events";

const tierColor: Record<Difficulty, string> = {
  beginner: "text-tier-beginner border-tier-beginner/40",
  intermediate: "text-tier-intermediate border-tier-intermediate/40",
  advanced: "text-tier-advanced border-tier-advanced/40",
};

export function DifficultyRibbon({ tier }: { tier: Difficulty }) {
  return (
    <span title={difficultyLabel[tier]} className="inline-flex items-center">
      <span
        className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tierColor[tier]}`}
        aria-hidden
      >
        {difficultyLabel[tier]}
      </span>
      <span className="sr-only">{difficultyLabel[tier]}</span>
    </span>
  );
}
