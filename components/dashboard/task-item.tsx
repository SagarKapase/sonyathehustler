"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LearningTask } from "@/lib/learning-plan";
import { RichText } from "../ui/rich-text";

const KIND_LABEL: Record<LearningTask["kind"], string> = {
  topic: "Topic",
  question: "Question",
};

interface TaskItemProps {
  task: LearningTask;
  done: boolean;
  onToggle: (done: boolean) => void;
  /** Show a topic's study points without clicking. */
  defaultExpanded?: boolean;
}

export function TaskItem({ task, done, onToggle, defaultExpanded = false }: TaskItemProps) {
  const checkboxId = useId();
  const pointsId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasPoints = Boolean(task.points?.length);

  const titleClass = cn(
    "text-left text-[13px] font-medium transition-colors",
    done ? "text-zinc-400 line-through decoration-zinc-300" : "text-zinc-900",
  );

  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={done}
          aria-label={`Mark "${task.title.replaceAll("`", "")}" as ${task.kind === "question" ? "solved" : "done"}`}
          onChange={(event) => onToggle(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-accent"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {hasPoints ? (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  aria-expanded={expanded}
                  aria-controls={pointsId}
                  className={cn("group inline-flex items-start gap-1", titleClass)}
                >
                  <span>
                    <RichText text={task.title} />
                  </span>
                  <ChevronRight
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0 text-zinc-400 transition-transform duration-150 group-hover:text-zinc-600",
                      expanded && "rotate-90",
                    )}
                  />
                </button>
              ) : task.href ? (
                <Link href={task.href} className={cn(titleClass, "hover:text-accent hover:underline")}>
                  {task.title}
                </Link>
              ) : (
                <label htmlFor={checkboxId} className={cn(titleClass, "cursor-pointer")}>
                  {task.title}
                </label>
              )}
              <p className="mt-0.5 text-xs text-zinc-500">
                <RichText text={task.description} />
              </p>
            </div>
            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className="rounded border border-zinc-200 px-1.5 py-px font-mono text-[10px] text-zinc-500 uppercase">
                {KIND_LABEL[task.kind]}
              </span>
              <span className={cn("text-[11px]", done ? "text-accent" : "text-zinc-400")}>
                {done ? (task.kind === "question" ? "Solved" : "Done") : "Pending"}
              </span>
            </span>
          </div>

          {hasPoints && expanded && (
            <ul id={pointsId} className="mt-2.5 space-y-1.5 border-l border-zinc-200 pl-3">
              {task.points?.map((point) => (
                <li key={point} className="text-xs leading-relaxed text-zinc-600">
                  <RichText text={point} />
                </li>
              ))}
            </ul>
          )}

          {task.href && (
            <Link
              href={task.href}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              View problem
              <ArrowUpRight className="size-3" />
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
