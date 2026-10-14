"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/cn";
import { CODING_QUESTIONS } from "@/lib/content/coding-questions";
import { questionHref, questionTaskId } from "@/lib/learning-plan";
import { getNavItem } from "@/lib/navigation";
import { DifficultyBadge } from "./ui/difficulty-badge";
import { PageHeader } from "./ui/page-header";
import { ProgressBar } from "./ui/progress-bar";

const NAV_ITEM = getNavItem("/coding-questions");

export function CodingQuestionsList() {
  const { completed, setTaskDone, solvedQuestions, totalQuestions, currentDay } = useLearningProgress();
  const percent = totalQuestions === 0 ? 0 : Math.round((solvedQuestions / totalQuestions) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={NAV_ITEM.label}
        description={NAV_ITEM.description}
        aside={
          <div className="w-full sm:w-56">
            <div className="mb-1.5 flex items-baseline justify-between text-xs">
              <span className="text-zinc-500">
                {solvedQuestions} of {totalQuestions} solved
              </span>
              <span className="font-mono font-medium text-zinc-900 tabular-nums">{percent}%</span>
            </div>
            <ProgressBar value={percent} label="Coding questions solved" />
          </div>
        }
      />

      <ul className="divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {CODING_QUESTIONS.map((question) => {
          const taskId = questionTaskId(question);
          const solved = Boolean(completed[taskId]);
          return (
            <li key={question.slug} className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-50">
              <input
                type="checkbox"
                checked={solved}
                onChange={(event) => setTaskDone(taskId, event.target.checked)}
                aria-label={`Mark "${question.title}" as solved`}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-accent"
              />
              <Link href={questionHref(question)} className="group flex min-w-0 flex-1 items-start gap-3">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-mono text-[11px] text-zinc-400 uppercase">Day {question.day}</span>
                    <span
                      className={cn(
                        "text-[13px] font-medium group-hover:text-accent",
                        solved ? "text-zinc-500" : "text-zinc-900",
                      )}
                    >
                      {question.title}
                    </span>
                    {question.day === currentDay && !solved && (
                      <span className="rounded bg-accent-soft px-1 py-px text-[10px] font-medium text-accent">
                        Today
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500">{question.summary}</span>
                  <span className="mt-2 hidden flex-wrap gap-1 sm:flex">
                    {question.concepts.map((concept) => (
                      <span key={concept} className="rounded bg-zinc-100 px-1.5 py-px text-[11px] text-zinc-600">
                        {concept}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className={cn("hidden text-[11px] sm:inline", solved ? "text-accent" : "text-zinc-400")}>
                    {solved ? "Solved" : "Unsolved"}
                  </span>
                  <DifficultyBadge difficulty={question.difficulty} />
                  <ChevronRight className="size-4 text-zinc-300 transition-colors group-hover:text-zinc-500" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
