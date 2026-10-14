"use client";

import { useCallback, useMemo } from "react";
import { LEARNING_PLAN } from "@/lib/learning-plan";
import { computeProgress, type CompletedTasks } from "@/lib/progress";
import { STORAGE_KEYS } from "@/lib/storage";
import { useLocalStorage } from "./use-local-storage";

const NO_COMPLETED_TASKS: CompletedTasks = {};

/** Task completion state plus progress derived from it. */
export function useLearningProgress() {
  const [completed, setCompleted] = useLocalStorage(STORAGE_KEYS.tasks, NO_COMPLETED_TASKS);

  const progress = useMemo(() => computeProgress(LEARNING_PLAN, completed), [completed]);

  const setTaskDone = useCallback(
    (taskId: string, done: boolean) => {
      setCompleted((prev) => {
        const next = { ...prev };
        if (done) next[taskId] = true;
        else delete next[taskId];
        return next;
      });
    },
    [setCompleted],
  );

  return { ...progress, completed, setTaskDone };
}
