import { cn } from "@/lib/cn";
import { DAY_STATUS_LABEL, type DayProgress } from "@/lib/progress";
import { StatusIcon } from "../ui/status-icon";

interface LearningTimelineProps {
  days: DayProgress[];
  currentDay: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

/**
 * Day 1 → Day 7 journey. Vertical list on small screens, horizontal track
 * from `lg` up. Selecting a day shows its tasks.
 */
export function LearningTimeline({ days, currentDay, selectedDay, onSelectDay }: LearningTimelineProps) {
  return (
    <ol className="grid grid-cols-1 p-2 lg:grid-cols-7">
      {days.map((day, index) => {
        const isLast = index === days.length - 1;
        const isSelected = day.day === selectedDay;
        const isCurrent = day.day === currentDay;
        return (
          <li key={day.day} className="relative">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute z-10",
                  // vertical connector (below lg)
                  "top-[30px] -bottom-[10px] left-[19.5px] w-px",
                  // horizontal connector (lg+)
                  "lg:top-[19.5px] lg:bottom-auto lg:left-[34px] lg:-right-[6px] lg:h-px lg:w-auto",
                  day.status === "completed" ? "bg-accent" : "bg-zinc-200",
                )}
              />
            )}
            <button
              type="button"
              onClick={() => onSelectDay(day.day)}
              aria-pressed={isSelected}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors duration-150",
                "lg:flex-col lg:items-start lg:gap-2.5",
                isSelected ? "bg-zinc-100" : "hover:bg-zinc-50",
              )}
            >
              <span className="relative z-20 flex">
                <StatusIcon status={day.status} />
              </span>
              <span className="flex min-w-0 flex-1 items-center justify-between gap-2 lg:block lg:w-full">
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-medium text-zinc-900">Day {day.day}</span>
                    {isCurrent && (
                      <span className="rounded bg-accent-soft px-1 py-px text-[10px] font-medium text-accent">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-zinc-700" title={day.title}>
                    {day.shortTitle}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 lg:mt-1.5 lg:flex-col lg:items-start lg:gap-0.5">
                  <span className="text-xs text-zinc-500">{DAY_STATUS_LABEL[day.status]}</span>
                  <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                    {day.done}/{day.total} tasks
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
