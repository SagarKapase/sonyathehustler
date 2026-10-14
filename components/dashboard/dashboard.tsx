"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarRange, CodeXml, Gauge, ListChecks } from "lucide-react";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { LEARNING_PLAN } from "@/lib/learning-plan";
import { DAY_STATUS_LABEL } from "@/lib/progress";
import { Card } from "../ui/card";
import { ProgressBar } from "../ui/progress-bar";
import { StatusIcon } from "../ui/status-icon";
import { DailyUpdateEditor } from "./daily-update-editor";
import { DashboardHeader } from "./dashboard-header";
import { LearningTimeline } from "./learning-timeline";
import { StatCard } from "./stat-card";
import { TaskItem } from "./task-item";

export function Dashboard() {
  const progress = useLearningProgress();
  // `null` follows the current day as progress moves forward.
  const [pickedDay, setPickedDay] = useState<number | null>(null);

  const selectedDay = pickedDay ?? progress.currentDay;
  const viewingCurrent = selectedDay === progress.currentDay;
  const plan = LEARNING_PLAN.find((d) => d.day === selectedDay) ?? LEARNING_PLAN[0];
  const dayProgress = progress.days.find((d) => d.day === selectedDay) ?? progress.days[0];
  const dayPercent = dayProgress.total === 0 ? 0 : Math.round((dayProgress.done / dayProgress.total) * 100);

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Overall Progress" icon={Gauge} value={`${progress.percent}%`}>
          <ProgressBar value={progress.percent} label="Overall progress" />
        </StatCard>
        <StatCard
          label="Current Learning Day"
          icon={CalendarRange}
          value={`Day ${progress.currentDay}`}
          detail={`of ${progress.totalDays} days`}
        />
        <StatCard
          label="Completed Tasks"
          icon={ListChecks}
          value={
            <>
              {progress.completedTasks}
              <span className="text-base font-normal text-zinc-400"> / {progress.totalTasks}</span>
            </>
          }
          detail="tasks done"
        />
        <StatCard
          label="Coding Questions Solved"
          icon={CodeXml}
          value={
            <>
              {progress.solvedQuestions}
              <span className="text-base font-normal text-zinc-400"> / {progress.totalQuestions}</span>
            </>
          }
          detail="solved of assigned"
        />
      </div>

      <Card
        title="7-Day Learning Journey"
        description="Java in 7 days · select a day to view its tasks"
        aside={
          <Link
            href="/java"
            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            Full roadmap
            <ArrowRight className="size-3" />
          </Link>
        }
      >
        <LearningTimeline
          days={progress.days}
          currentDay={progress.currentDay}
          selectedDay={selectedDay}
          onSelectDay={(day) => setPickedDay(day === progress.currentDay ? null : day)}
        />
      </Card>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
        <Card
          className="lg:col-span-3"
          title={viewingCurrent ? "Today's Tasks" : `Day ${selectedDay} Tasks`}
          description={`Day ${selectedDay} of ${progress.totalDays} · ${plan.title}`}
          aside={
            viewingCurrent ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
                <StatusIcon status={dayProgress.status} className="size-3.5" />
                {DAY_STATUS_LABEL[dayProgress.status]}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setPickedDay(null)}
                className="h-7 rounded-md border border-zinc-200 px-2.5 text-xs text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                Back to today
              </button>
            )
          }
        >
          <p className="border-b border-zinc-100 bg-zinc-50/60 px-4 py-2.5 text-xs leading-relaxed text-zinc-600">
            <span className="font-medium text-zinc-800">Goal:</span> {plan.goal}
          </p>
          <ul className="divide-y divide-zinc-100">
            {plan.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                done={Boolean(progress.completed[task.id])}
                onToggle={(done) => progress.setTaskDone(task.id, done)}
              />
            ))}
          </ul>
          <div className="border-t border-zinc-100 px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                {dayProgress.done} of {dayProgress.total} completed
              </span>
              <span className="font-mono font-medium text-zinc-900 tabular-nums">{dayPercent}%</span>
            </div>
            <ProgressBar value={dayPercent} label={`Day ${selectedDay} progress`} />
          </div>
        </Card>

        <div className="lg:col-span-2">
          <DailyUpdateEditor />
        </div>
      </div>
    </div>
  );
}
