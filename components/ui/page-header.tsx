interface PageHeaderProps {
  title: string;
  description: string;
  /** Content shown on the right on wider screens (below the title on mobile). */
  aside?: React.ReactNode;
}

export function PageHeader({ title, description, aside }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </header>
  );
}
