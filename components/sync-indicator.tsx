"use client";

import { useSyncState } from "@/hooks/use-sync-state";
import { cn } from "@/lib/cn";
import type { SyncStatus } from "@/lib/sync";

const LABEL: Record<SyncStatus, string> = {
  checking: "Connecting…",
  syncing: "Saving…",
  synced: "Synced",
  offline: "Offline · saved on this device",
  locked: "Locked",
  disabled: "Saved on this device only",
};

const DOT: Record<SyncStatus, string> = {
  checking: "bg-zinc-300",
  syncing: "bg-accent/60 animate-pulse",
  synced: "bg-accent",
  offline: "bg-amber-500",
  locked: "bg-zinc-400",
  disabled: "bg-zinc-300",
};

/** Small sync status line for the sidebar. */
export function SyncIndicator({ compact = false }: { compact?: boolean }) {
  const { status } = useSyncState();

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500"
      title={compact ? LABEL[status] : undefined}
      role="status"
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", DOT[status])} aria-hidden="true" />
      {compact ? <span className="sr-only">{LABEL[status]}</span> : LABEL[status]}
    </span>
  );
}
