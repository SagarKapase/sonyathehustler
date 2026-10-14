"use client";

import { useSyncExternalStore } from "react";
import { toDateKey } from "@/lib/date";

const noopSubscribe = () => () => {};

/**
 * Today's local date as `YYYY-MM-DD`, or `null` during server rendering and
 * hydration. The date depends on the visitor's time zone, so it is only read
 * in the browser.
 */
export function useToday(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => toDateKey(new Date()),
    () => null,
  );
}
