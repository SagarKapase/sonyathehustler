"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TaskItem } from "./dashboard/task-item";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/cn";
import { LEARNING_PLAN } from "@/lib/learning-plan";
import { getNavItem } from "@/lib/navigation";
import { PageHeader } from "./ui/page-header";
import { ProgressBar } from "./ui/progress-bar";
import { StatusIcon } from "./ui/status-icon";

const NAV_ITEM = getNavItem("/java");

/** The full 7-day Java roadmap, one collapsible section per day. */
export function JavaRoadmap() {
  const progress = useLearningProgress();
  // `null` means "only the current day is open" until the user toggles a day.
  const [openDays, setOpenDays] = useState<Set<number> | null>(null);

  const isOpen = (day: number) => (openDays ? openDays.has(day) : day === progress.currentDay);

  function toggleDay(day: number) {
    setOpenDays((prev) => {
      const next = new Set(prev ?? [progress.currentDay]);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={NAV_ITEM.label}
        description={NAV_ITEM.description}
        aside={
          <div className="w-full sm:w-56">
            <div className="mb-1.5 flex items-baseline justify-between text-xs">
              <span className="text-zinc-500">
                {progress.completedTasks} of {progress.totalTasks} tasks
              </span>
              <span className="font-mono font-medium text-zinc-900 tabular-nums">{progress.percent}%</span>
            </div>
            <ProgressBar value={progress.percent} label="Java roadmap progress" />
          </div>
        }
      />

      <div className="space-y-3">
        {LEARNING_PLAN.map((day, index) => {
          const dayProgress = progress.days[index];
          const open = isOpen(day.day);
          const panelId = `java-day-${day.day}`;
          return (
            <section key={day.day} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <button
                type="button"
                onClick={() => toggleDay(day.day)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-zinc-50"
              >
                <StatusIcon status={dayProgress.status} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[11px] text-zinc-400 uppercase">Day {day.day}</span>
                    <span className="text-[13px] font-semibold text-zinc-900">{day.title}</span>
                    {day.day === progress.currentDay && (
                      <span className="rounded bg-accent-soft px-1 py-px text-[10px] font-medium text-accent">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-500">{day.goal}</span>
                </span>
                <span className="hidden font-mono text-[11px] text-zinc-400 tabular-nums sm:inline">
                  {dayProgress.done}/{dayProgress.total}
                </span>
                <ChevronDown
                  className={cn("size-4 shrink-0 text-zinc-400 transition-transform duration-150", open && "rotate-180")}
                />
              </button>

              {open && (
                <ul id={panelId} className="divide-y divide-zinc-100 border-t border-zinc-100">
                  {day.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      done={Boolean(progress.completed[task.id])}
                      onToggle={(done) => progress.setTaskDone(task.id, done)}
                      defaultExpanded
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
