"use client";

import { Check } from "lucide-react";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/cn";

export function SolvedToggle({ taskId }: { taskId: string }) {
  const { completed, setTaskDone } = useLearningProgress();
  const solved = Boolean(completed[taskId]);

  return (
    <button
      type="button"
      onClick={() => setTaskDone(taskId, !solved)}
      aria-pressed={solved}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-md border px-3 text-[13px] font-medium transition-colors",
        solved
          ? "border-accent/30 bg-accent-soft text-accent hover:bg-accent-soft/70"
          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
      )}
    >
      <Check className={cn("size-3.5", !solved && "text-zinc-400")} />
      {solved ? "Solved" : "Mark as solved"}
    </button>
  );
}
