"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToday } from "@/hooks/use-today";
import { formatShortDate, formatTime } from "@/lib/date";
import { STORAGE_KEYS } from "@/lib/storage";
import { Card } from "../ui/card";

interface DailyUpdate {
  learned: string;
  stuck: string;
  updatedAt: string;
}

/** Daily updates keyed by local date (YYYY-MM-DD). */
type DailyUpdates = Record<string, DailyUpdate>;

interface Draft {
  date: string;
  learned: string;
  stuck: string;
}

const NO_UPDATES: DailyUpdates = {};

export function DailyUpdateEditor() {
  const today = useToday();
  const [updates, setUpdates] = useLocalStorage(STORAGE_KEYS.dailyUpdates, NO_UPDATES);
  const [draft, setDraft] = useState<Draft | null>(null);

  const todayEntry = today ? updates[today] : undefined;
  // With no saved entry for today, the form is open by default.
  const active: Draft | null =
    draft ?? (today && !todayEntry ? { date: today, learned: "", stuck: "" } : null);
  const isEditingExisting = active !== null && updates[active.date] !== undefined;
  const canSave = active !== null && (active.learned.trim() !== "" || active.stuck.trim() !== "");

  const previous = Object.entries(updates)
    .filter(([date]) => date !== today)
    .sort(([a], [b]) => b.localeCompare(a));

  function startEditing(date: string) {
    const entry = updates[date];
    setDraft({ date, learned: entry?.learned ?? "", stuck: entry?.stuck ?? "" });
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!active || !canSave) return;
    setUpdates((prev) => ({
      ...prev,
      [active.date]: {
        learned: active.learned.trim(),
        stuck: active.stuck.trim(),
        updatedAt: new Date().toISOString(),
      },
    }));
    setDraft(null);
  }

  return (
    <Card title="Daily Update" description="What you learned today and where you got stuck.">
      <div className="p-4">
        {today === null ? (
          <div className="h-44" aria-hidden="true" />
        ) : active ? (
          <form onSubmit={save} className="space-y-3">
            {active.date !== today && (
              <p className="text-xs text-zinc-500">
                Editing update for <span className="font-medium text-zinc-700">{formatShortDate(active.date)}</span>
              </p>
            )}
            <Field
              id="update-learned"
              label="What did you learn?"
              placeholder="Concepts, examples, or anything that clicked today…"
              rows={4}
              value={active.learned}
              onChange={(learned) => setDraft({ ...active, learned })}
            />
            <Field
              id="update-stuck"
              label="Where did you get stuck?"
              placeholder="Questions, errors, or topics to revisit…"
              rows={3}
              value={active.stuck}
              onChange={(stuck) => setDraft({ ...active, stuck })}
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              {isEditingExisting && (
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="h-8 rounded-md px-3 text-[13px] text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!canSave}
                className="h-8 rounded-md bg-zinc-900 px-3 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {isEditingExisting ? "Save changes" : "Save update"}
              </button>
            </div>
          </form>
        ) : (
          todayEntry && <SavedUpdate entry={todayEntry} onEdit={() => startEditing(today)} />
        )}
      </div>

      {previous.length > 0 && (
        <div className="border-t border-zinc-100">
          <p className="px-4 pt-3 pb-1 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
            Previous updates
          </p>
          <ul className="pb-2">
            {previous.map(([date, entry]) => (
              <li key={date} className="flex items-start justify-between gap-3 px-4 py-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-700">{formatShortDate(date)}</p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {entry.learned || entry.stuck || "No details"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEditing(date)}
                  className="inline-flex h-6 shrink-0 items-center gap-1 rounded px-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  <Pencil className="size-3" />
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function SavedUpdate({ entry, onEdit }: { entry: DailyUpdate; onEdit: () => void }) {
  return (
    <div className="space-y-3">
      <SavedField label="What I learned" value={entry.learned} />
      <SavedField label="Where I got stuck" value={entry.stuck} />
      <div className="flex items-center justify-between pt-1">
        <p className="text-[11px] text-zinc-400">Saved at {formatTime(entry.updatedAt)}</p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 px-3 text-[13px] text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          <Pencil className="size-3.5" />
          Edit update
        </button>
      </div>
    </div>
  );
}

function SavedField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-800">
        {value || <span className="text-zinc-400">Nothing noted.</span>}
      </p>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  rows: number;
  value: string;
  onChange: (value: string) => void;
}

function Field({ id, label, placeholder, rows, value, onChange }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-zinc-700">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 block w-full resize-y rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-[13px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition-colors outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
      />
    </div>
  );
}
