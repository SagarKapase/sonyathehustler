import type { LearningDay } from "./learning-plan";

export type DayStatus = "not-started" | "in-progress" | "completed";

/** Map of completed task id -> true, as persisted in localStorage. */
export type CompletedTasks = Record<string, boolean>;

export interface DayProgress {
  day: number;
  title: string;
  shortTitle: string;
  done: number;
  total: number;
  status: DayStatus;
}

export interface LearningProgress {
  days: DayProgress[];
  /** First day that is not fully completed (or the last day once all are done). */
  currentDay: number;
  totalDays: number;
  completedTasks: number;
  totalTasks: number;
  solvedQuestions: number;
  totalQuestions: number;
  /** 0–100, rounded. */
  percent: number;
}

export const DAY_STATUS_LABEL: Record<DayStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};

export function computeProgress(plan: LearningDay[], completed: CompletedTasks): LearningProgress {
  let completedTasks = 0;
  let totalTasks = 0;
  let solvedQuestions = 0;
  let totalQuestions = 0;

  const days = plan.map(({ day, title, shortTitle, tasks }) => {
    const done = tasks.filter((task) => completed[task.id]).length;
    completedTasks += done;
    totalTasks += tasks.length;

    for (const task of tasks) {
      if (task.kind !== "question") continue;
      totalQuestions += 1;
      if (completed[task.id]) solvedQuestions += 1;
    }

    const status: DayStatus =
      done === 0 ? "not-started" : done === tasks.length ? "completed" : "in-progress";
    return { day, title, shortTitle, done, total: tasks.length, status };
  });

  const current = days.find((d) => d.status !== "completed") ?? days[days.length - 1];

  return {
    days,
    currentDay: current?.day ?? 1,
    totalDays: days.length,
    completedTasks,
    totalTasks,
    solvedQuestions,
    totalQuestions,
    percent: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
  };
}
