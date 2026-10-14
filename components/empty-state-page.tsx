import type { NavItem } from "@/lib/navigation";
import { PageHeader } from "./ui/page-header";

/** Placeholder page for roadmap sections whose content hasn't been added yet. */
export function EmptyStatePage({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <div className="space-y-6">
      <PageHeader title={item.label} description={item.description} />

      <section className="flex flex-col items-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <span className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
          <Icon className="size-5 text-zinc-500" strokeWidth={1.75} />
        </span>
        <p className="mt-4 text-sm font-medium text-zinc-900">Learning content will be added soon.</p>
        <p className="mt-1 max-w-sm text-xs text-zinc-500">
          This section is set up and ready. Topics and progress tracking will appear here once
          they are assigned.
        </p>
      </section>
    </div>
  );
}
