"use client";

import { useSyncExternalStore } from "react";
import { getServerSyncState, getSyncState, subscribeSync } from "@/lib/sync";

export function useSyncState() {
  return useSyncExternalStore(subscribeSync, getSyncState, getServerSyncState);
}
