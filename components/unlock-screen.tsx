"use client";

import { useState } from "react";
import { LockKeyhole, Route } from "lucide-react";
import { unlock } from "@/lib/sync";

export function UnlockScreen() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!passcode || submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await unlock(passcode);
    if (result === "wrong-passcode") setError("That passcode isn't right.");
    else if (result === "error") setError("Couldn't reach the server. Try again.");
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-zinc-900 text-white">
            <Route className="size-3.5" strokeWidth={2.25} />
          </span>
          <span className="text-[13px] font-semibold tracking-tight">Learning Roadmap</span>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <LockKeyhole className="size-4 text-zinc-400" />
            <h1 className="text-sm font-semibold text-zinc-900">Enter passcode</h1>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Progress is shared between devices. Enter the passcode once on this browser to continue.
          </p>

          <label htmlFor="passcode" className="mt-4 block text-xs font-medium text-zinc-700">
            Passcode
          </label>
          <input
            id="passcode"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            aria-invalid={error !== null}
            aria-describedby={error ? "passcode-error" : undefined}
            className="mt-1.5 block h-9 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[13px] text-zinc-900 transition-colors outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
          />
          {error && (
            <p id="passcode-error" className="mt-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!passcode || submitting}
            className="mt-4 h-9 w-full rounded-md bg-zinc-900 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {submitting ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
