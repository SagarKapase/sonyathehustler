/**
 * Background sync between localStorage and the server (/api/progress).
 *
 * - Local writes to synced keys are pushed right away (latest value wins).
 * - The server is pulled on start, when the tab regains focus, and every 30s.
 * - Unconfirmed local changes are remembered in localStorage, so they survive
 *   a reload while offline and are never overwritten by an older server copy.
 */

import {
  STORAGE_KEYS,
  SYNCED_KEYS,
  onLocalWrite,
  readRaw,
  safeParse,
  writeValue,
  type StorageKey,
} from "./storage";

export type SyncStatus =
  | "checking" // first request in flight
  | "synced"
  | "syncing" // pushing local changes
  | "offline" // server unreachable; changes are kept locally
  | "locked" // passcode required
  | "disabled"; // server has no database/passcode configured: local-only mode

export interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
}

type SyncedKey = (typeof SYNCED_KEYS)[number];

const PULL_INTERVAL_MS = 30_000;
const INITIAL_STATE: SyncState = { status: "checking", lastSyncedAt: null };

let state: SyncState = INITIAL_STATE;
const listeners = new Set<() => void>();
const inflight = new Set<SyncedKey>();

function setState(patch: Partial<SyncState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export function subscribeSync(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSyncState = () => state;
export const getServerSyncState = () => INITIAL_STATE;

// ---- pending keys (persisted) -------------------------------------------

const NO_PENDING: string[] = [];

function getPending(): SyncedKey[] {
  const keys = safeParse(readRaw(STORAGE_KEYS.syncPending), NO_PENDING);
  return SYNCED_KEYS.filter((key) => keys.includes(key));
}

function setPending(key: SyncedKey, isPending: boolean) {
  const keys = new Set<string>(getPending());
  if (isPending) keys.add(key);
  else keys.delete(key);
  writeValue(STORAGE_KEYS.syncPending, [...keys]);
}

const isSyncedKey = (key: StorageKey): key is SyncedKey =>
  (SYNCED_KEYS as readonly StorageKey[]).includes(key);

// ---- network --------------------------------------------------------------

function handleFailure(status: number) {
  if (status === 401) setState({ status: "locked" });
  else if (status === 503) setState({ status: "disabled" });
  else setState({ status: "offline" });
}

function markSyncedIfIdle() {
  if (inflight.size === 0 && getPending().length === 0) {
    setState({ status: "synced", lastSyncedAt: Date.now() });
  }
}

async function push(key: SyncedKey) {
  if (inflight.has(key)) return; // the running push re-checks pending when it finishes
  if (state.status === "locked" || state.status === "disabled") return;
  inflight.add(key);
  try {
    // Loop so edits made while a request is in flight are sent afterwards.
    while (getPending().includes(key)) {
      const raw = readRaw(key);
      setPending(key, false);
      if (raw === null) break;
      setState({ status: "syncing" });
      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: JSON.parse(raw) }),
      });
      if (!response.ok) {
        setPending(key, true);
        handleFailure(response.status);
        return;
      }
    }
  } catch {
    setPending(key, true);
    setState({ status: "offline" });
    return;
  } finally {
    inflight.delete(key);
  }
  markSyncedIfIdle();
}

/** Fetches the server copy and applies it, or uploads local data the server lacks. */
export async function pull() {
  if (state.status === "disabled") return;
  try {
    const response = await fetch("/api/progress", { cache: "no-store" });
    if (!response.ok) return handleFailure(response.status);

    const { entries } = (await response.json()) as { entries: Record<string, { value: unknown }> };
    const pending = getPending();

    for (const key of SYNCED_KEYS) {
      if (pending.includes(key) || inflight.has(key)) continue; // local changes win until confirmed
      const remote = entries[key];
      const localRaw = readRaw(key);
      if (remote) {
        if (localRaw === null || !sameJson(JSON.parse(localRaw), remote.value)) {
          writeValue(key, remote.value, { fromRemote: true });
        }
      } else if (localRaw !== null) {
        // First sync from a device that already has progress: upload it.
        setPending(key, true);
      }
    }

    const toPush = getPending();
    if (toPush.length === 0) markSyncedIfIdle();
    toPush.forEach((key) => void push(key));
  } catch {
    setState({ status: "offline" });
  }
}

/** Sends the passcode. On success the session cookie is set and data is pulled. */
export async function unlock(passcode: string): Promise<"ok" | "wrong-passcode" | "error"> {
  try {
    const response = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    if (response.status === 401) return "wrong-passcode";
    if (!response.ok) return "error";
    setState({ status: "checking" });
    await pull();
    return "ok";
  } catch {
    return "error";
  }
}

/** Starts background syncing. Returns a cleanup function. */
export function startSync() {
  const offLocalWrite = onLocalWrite((key) => {
    if (!isSyncedKey(key) || state.status === "disabled") return;
    setPending(key, true);
    void push(key);
  });

  const pullIfVisible = () => {
    if (document.visibilityState === "visible") void pull();
  };
  window.addEventListener("focus", pullIfVisible);
  document.addEventListener("visibilitychange", pullIfVisible);
  const timer = window.setInterval(pullIfVisible, PULL_INTERVAL_MS);

  void pull();

  return () => {
    offLocalWrite();
    window.removeEventListener("focus", pullIfVisible);
    document.removeEventListener("visibilitychange", pullIfVisible);
    window.clearInterval(timer);
  };
}

/** Structural equality for JSON values (Postgres jsonb may reorder object keys). */
function sameJson(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) =>
    sameJson((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
  );
}
