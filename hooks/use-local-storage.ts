"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { readRaw, safeParse, subscribe, writeValue, type StorageKey } from "@/lib/storage";

type SetValue<T> = (next: T | ((prev: T) => T)) => void;

/**
 * Reads and writes a JSON value in localStorage.
 *
 * The server render (and the hydration pass) always sees `fallback`, then the
 * stored value is picked up on the client, so there are no hydration
 * mismatches. `fallback` should be a stable reference (e.g. a module constant).
 */
export function useLocalStorage<T>(key: StorageKey, fallback: T): [T, SetValue<T>] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo(() => safeParse(raw, fallback), [raw, fallback]);

  const setValue = useCallback<SetValue<T>>(
    (next) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(safeParse(readRaw(key), fallback))
          : next;
      writeValue(key, resolved);
    },
    [key, fallback],
  );

  return [value, setValue];
}
