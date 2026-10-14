import { neon } from "@neondatabase/serverless";

/**
 * Progress storage in Postgres (Neon). One row per synced storage key, holding
 * the same JSON value the browser keeps in localStorage.
 */

type Sql = ReturnType<typeof neon>;

export interface StoredEntry {
  value: unknown;
  updatedAt: string;
}

let sql: Sql | null = null;
let ready: Promise<unknown> | null = null;

async function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  sql ??= neon(url);
  // Create the table on first use so no separate migration step is needed.
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS learning_progress (
      key        text PRIMARY KEY,
      value      jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `.catch((error) => {
    ready = null;
    throw error;
  });
  await ready;
  return sql;
}

export async function readAllEntries(): Promise<Record<string, StoredEntry>> {
  const query = await db();
  const rows = (await query`SELECT key, value, updated_at FROM learning_progress`) as Array<{
    key: string;
    value: unknown;
    updated_at: Date | string;
  }>;
  return Object.fromEntries(
    rows.map((row) => [row.key, { value: row.value, updatedAt: new Date(row.updated_at).toISOString() }]),
  );
}

export async function writeEntry(key: string, value: unknown): Promise<string> {
  const query = await db();
  const rows = (await query`
    INSERT INTO learning_progress (key, value, updated_at)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    RETURNING updated_at
  `) as Array<{ updated_at: Date | string }>;
  return new Date(rows[0].updated_at).toISOString();
}
