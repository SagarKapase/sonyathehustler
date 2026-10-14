import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  value: React.ReactNode;
  detail?: React.ReactNode;
  children?: React.ReactNode;
}

export function StatCard({ label, icon: Icon, value, detail, children }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <Icon className="size-3.5 text-zinc-400" />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">{value}</p>
      {detail && <p className="mt-0.5 text-xs text-zinc-500">{detail}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
