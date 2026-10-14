"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSyncState } from "@/hooks/use-sync-state";
import { cn } from "@/lib/cn";
import { STORAGE_KEYS } from "@/lib/storage";
import { startSync } from "@/lib/sync";
import { Sidebar } from "./sidebar";
import { UnlockScreen } from "./unlock-screen";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useLocalStorage(STORAGE_KEYS.sidebarCollapsed, false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { status } = useSyncState();

  useEffect(() => startSync(), []);

  // Close the mobile drawer with Escape and lock page scroll while it is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (status === "locked") return <UnlockScreen />;

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-zinc-200 bg-sidebar transition-[width] duration-200 ease-out md:block",
          collapsed ? "w-14" : "w-60",
        )}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-zinc-200 bg-canvas/95 px-3 backdrop-blur-sm md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex size-8 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
        >
          <Menu className="size-4" />
        </button>
        <span className="text-[13px] font-semibold tracking-tight">Learning Roadmap</span>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-zinc-900/20 transition-opacity duration-200 md:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-200 bg-sidebar shadow-lg transition-transform duration-200 ease-out md:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} onNavigate={() => setDrawerOpen(false)} />
      </aside>

      <div className={cn("transition-[padding] duration-200 ease-out", collapsed ? "md:pl-14" : "md:pl-60")}>
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
