import type { DayStatus } from "@/lib/progress";
import { cn } from "@/lib/cn";

/** Small circular status glyph: empty, half-filled, or checked. */
export function StatusIcon({ status, className }: { status: DayStatus; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-4 shrink-0", className)} aria-hidden="true">
      {status === "not-started" && (
        <circle cx="8" cy="8" r="6.25" fill="white" strokeWidth="1.5" className="stroke-zinc-300" />
      )}
      {status === "in-progress" && (
        <>
          <circle cx="8" cy="8" r="6.25" fill="white" strokeWidth="1.5" className="stroke-accent" />
          <path d="M8 4a4 4 0 0 1 0 8z" className="fill-accent" />
        </>
      )}
      {status === "completed" && (
        <>
          <circle cx="8" cy="8" r="7" className="fill-accent" />
          <path
            d="M5.25 8.25 7.1 10l3.65-3.75"
            fill="none"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
