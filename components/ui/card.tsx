import { cn } from "@/lib/cn";

interface CardProps {
  title: string;
  description?: string;
  /** Content shown on the right side of the card header. */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** A bordered section with a compact header. */
export function Card({ title, description, aside, className, children }: CardProps) {
  return (
    <section className={cn("rounded-lg border border-zinc-200 bg-white", className)}>
      <header className="flex items-start justify-between gap-4 border-b border-zinc-100 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-zinc-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </header>
      {children}
    </section>
  );
}
