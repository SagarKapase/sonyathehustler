/**
 * Versioned, SSR-safe wrapper around window.localStorage.
 *
 * Every key is stored as `learning-roadmap:v<VERSION>:<name>`. Bump VERSION
 * when a stored shape changes incompatibly; old entries are simply ignored.
 *
 * Note: localStorage is specific to one browser on one device. Nothing here
 * syncs between devices.
 */

const NAMESPACE = "learning-roadmap";
const VERSION = 1;

export const STORAGE_KEYS = {
  /** Completed task ids for the learning plan. */
  tasks: "tasks",
  /** Daily learning updates, keyed by local date (YYYY-MM-DD). */
  dailyUpdates: "daily-updates",
  /** Whether the desktop sidebar is collapsed. */
  sidebarCollapsed: "sidebar-collapsed",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function fullKey(key: StorageKey) {
  return `${NAMESPACE}:v${VERSION}:${key}`;
}

/** True when `value` has the same basic shape as `fallback`. */
function matchesShape(value: unknown, fallback: unknown) {
  if (Array.isArray(fallback)) return Array.isArray(value);
  if (fallback !== null && typeof fallback === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  return typeof value === typeof fallback;
}

/** Parses JSON, returning `fallback` for missing, malformed, or mismatched data. */
export function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return matchesShape(parsed, fallback) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readRaw(key: StorageKey): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(fullKey(key));
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();

export function writeValue<T>(key: StorageKey, value: T) {
  try {
    window.localStorage.setItem(fullKey(key), JSON.stringify(value));
  } catch {
    // Storage can be full or disabled (e.g. private mode); keep the UI usable.
  }
  listeners.forEach((listener) => listener());
}

/** Subscribes to writes from this tab and from other tabs of the same browser. */
export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(`${NAMESPACE}:`)) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
