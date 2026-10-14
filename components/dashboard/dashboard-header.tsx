"use client";

import { CalendarDays } from "lucide-react";
import { useToday } from "@/hooks/use-today";
import { formatLongDate } from "@/lib/date";
import { PageHeader } from "../ui/page-header";

export function DashboardHeader() {
  const today = useToday();

  return (
    <PageHeader
      title="Learning Dashboard"
      description="Your daily learning progress, all in one place."
      aside={
        <p className="inline-flex h-7 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-xs text-zinc-600">
          <CalendarDays className="size-3.5 text-zinc-400" />
          {today ? (
            <time dateTime={today}>{formatLongDate(today)}</time>
          ) : (
            <span className="inline-block h-3 w-40 rounded bg-zinc-100" aria-hidden="true" />
          )}
        </p>
      }
    />
  );
}
