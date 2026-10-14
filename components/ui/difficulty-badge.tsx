import type { Difficulty } from "@/lib/content/coding-questions";
import { cn } from "@/lib/cn";

const STYLES: Record<Difficulty, string> = {
  Easy: "border-zinc-200 text-zinc-600",
  Medium: "border-accent/30 text-accent",
  Hard: "border-zinc-900 bg-zinc-900 text-white",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={cn("inline-flex h-5 items-center rounded border px-1.5 text-[11px] font-medium", STYLES[difficulty])}>
      {difficulty}
    </span>
  );
}
