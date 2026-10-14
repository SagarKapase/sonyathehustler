"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Route, X } from "lucide-react";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS } from "@/lib/navigation";
import { ProgressBar } from "./ui/progress-bar";

interface SidebarProps {
  collapsed?: boolean;
  /** Desktop only: toggles the collapsed state. */
  onToggleCollapse?: () => void;
  /** Mobile only: closes the drawer. */
  onClose?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse, onClose, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn("flex h-12 items-center border-b border-zinc-200/80 px-3", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-white">
              <Route className="size-3.5" strokeWidth={2.25} />
            </span>
            <span className="truncate text-[13px] font-semibold tracking-tight">Learning Roadmap</span>
          </div>
        )}
        {onToggleCollapse && (
          <IconButton
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapse}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </IconButton>
        )}
        {onClose && (
          <IconButton label="Close navigation" onClick={onClose}>
            <X className="size-4" />
          </IconButton>
        )}
      </div>

      {/* Navigation. Reading the pathname can suspend on routes that aren't
          prerendered, so the fallback shows the same links without a highlight. */}
      <Suspense fallback={<NavLinks pathname={null} collapsed={collapsed} onNavigate={onNavigate} />}>
        <ActiveNavLinks collapsed={collapsed} onNavigate={onNavigate} />
      </Suspense>

      <SidebarProgress collapsed={collapsed} />
    </div>
  );
}

interface NavLinksProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

function ActiveNavLinks(props: NavLinksProps) {
  return <NavLinks pathname={usePathname()} {...props} />;
}

function NavLinks({ pathname, collapsed, onNavigate }: NavLinksProps & { pathname: string | null }) {
  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3">
      {NAV_SECTIONS.map((section, index) => (
        <div key={section.label} className={cn(index > 0 && "mt-5")}>
          {collapsed ? (
            index > 0 && <div className="mx-2 mb-3 border-t border-zinc-200" />
          ) : (
            <p className="mb-1 px-2 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
              {section.label}
            </p>
          )}
          <ul className="space-y-px">
            {section.items.map((item) => {
              const active =
                  pathname !== null && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex h-8 items-center gap-2.5 rounded-md text-[13px] transition-colors duration-150",
                      collapsed ? "justify-center" : "px-2",
                      active
                        ? "bg-zinc-200/70 font-medium text-zinc-900"
                        : "text-zinc-600 hover:bg-zinc-200/40 hover:text-zinc-900",
                    )}
                  >
                    {active && (
                      <span className="absolute top-1.5 bottom-1.5 -left-2 w-0.5 rounded-r-full bg-accent" aria-hidden="true" />
                    )}
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active ? "text-accent" : "text-zinc-400 group-hover:text-zinc-600",
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarProgress({ collapsed }: { collapsed: boolean }) {
  const { percent, completedTasks, totalTasks } = useLearningProgress();

  if (collapsed) {
    return (
      <div className="flex justify-center border-t border-zinc-200/80 py-3" title={`Overall progress: ${percent}%`}>
        <ProgressRing percent={percent} />
      </div>
    );
  }

  return (
    <div className="border-t border-zinc-200/80 px-4 py-3">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs text-zinc-500">Overall progress</span>
        <span className="font-mono text-xs font-medium text-zinc-900 tabular-nums">{percent}%</span>
      </div>
      <ProgressBar value={percent} />
      <p className="mt-2 text-[11px] text-zinc-500 tabular-nums">
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </div>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 24 24" className="size-6 -rotate-90" role="img" aria-label={`Overall progress ${percent}%`}>
      <circle cx="12" cy="12" r={radius} fill="none" strokeWidth="2.5" className="stroke-zinc-200" />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
        className={cn("stroke-accent transition-[stroke-dashoffset] duration-300", percent === 0 && "opacity-0")}
      />
    </svg>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900"
    >
      {children}
    </button>
  );
}
