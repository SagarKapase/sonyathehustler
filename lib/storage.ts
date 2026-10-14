/**
 * Versioned, SSR-safe wrapper around window.localStorage.
 *
 * Every key is stored as `learning-roadmap:v<VERSION>:<name>`. Bump VERSION
 * when a stored shape changes incompatibly; old entries are simply ignored.
 *
 * localStorage is the source of truth for the UI. Keys listed in SYNCED_KEYS
 * are also mirrored to the server by lib/sync.ts when sync is configured.
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
  /** Synced keys with local changes the server hasn't confirmed yet. */
  syncPending: "sync-pending",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** Keys shared between devices through the server. Device preferences stay local. */
export const SYNCED_KEYS = [STORAGE_KEYS.tasks, STORAGE_KEYS.dailyUpdates] as const;

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
const localWriteListeners = new Set<(key: StorageKey) => void>();

/**
 * Stores `value` and notifies subscribers. Writes that came from the server
 * pass `fromRemote` so they aren't sent back to it.
 */
export function writeValue<T>(key: StorageKey, value: T, { fromRemote = false } = {}) {
  try {
    window.localStorage.setItem(fullKey(key), JSON.stringify(value));
  } catch {
    // Storage can be full or disabled (e.g. private mode); keep the UI usable.
  }
  listeners.forEach((listener) => listener());
  if (!fromRemote) localWriteListeners.forEach((listener) => listener(key));
}

/** Called for every write made by this tab's UI (not for remote updates). */
export function onLocalWrite(listener: (key: StorageKey) => void) {
  localWriteListeners.add(listener);
  return () => {
    localWriteListeners.delete(listener);
  };
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
