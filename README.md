# Learning Roadmap

A personal learning roadmap and progress tracker. Built with Next.js (App Router), React, TypeScript, Tailwind CSS, and Lucide icons.

Progress is saved in the browser's `localStorage` and, when configured, synced through a Neon Postgres database so a learner and a mentor see the same progress on different devices.

## Sync setup

Copy `.env.example` to `.env.local` and set:

- `DATABASE_URL`: Neon connection string. The `learning_progress` table is created automatically.
- `APP_PASSCODE`: shared passcode. Each browser enters it once; changing it signs everyone out.

If either is missing, the app runs in local-only mode. Set the same two variables in your hosting provider (e.g. Vercel → Project → Settings → Environment Variables) when deploying.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:3000).

## Project structure

```
app/                     Routes (dashboard + one page per roadmap section)
components/
  app-shell.tsx          Page frame: desktop sidebar, mobile top bar and drawer
  sidebar.tsx            Navigation, collapse toggle, overall progress
  java-roadmap.tsx       /java — the 7-day roadmap, one collapsible section per day
  coding-questions-list.tsx  /coding-questions — all daily questions with solved status
  question-detail.tsx    /coding-questions/[slug] — full problem statement
  empty-state-page.tsx   Placeholder for roadmap sections without content yet
  dashboard/             Dashboard sections (header, stats, timeline, tasks, daily update)
  ui/                    Small shared primitives (card, page header, badges, progress bar)
hooks/                   useLocalStorage, useLearningProgress, useToday
lib/
  storage.ts             Versioned localStorage keys and safe JSON parsing
  content/
    java-roadmap.ts      What to learn each day (edit topics here)
    coding-questions.ts  One coding question per day (edit problems here)
  learning-plan.ts       Combines the two into the 7-day plan and its tasks
  progress.ts            Derives progress and day statuses from completed tasks
  navigation.ts          Sidebar items, shared with the section pages
```
