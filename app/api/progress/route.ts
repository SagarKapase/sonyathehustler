import { isAuthenticated, isSyncConfigured } from "@/lib/server/auth";
import { readAllEntries, writeEntry } from "@/lib/server/db";
import { SYNCED_KEYS } from "@/lib/storage";

const MAX_VALUE_BYTES = 200_000;
const NO_STORE = { "Cache-Control": "no-store" };

async function guard() {
  if (!isSyncConfigured()) return Response.json({ error: "sync-disabled" }, { status: 503, headers: NO_STORE });
  if (!(await isAuthenticated())) return Response.json({ error: "locked" }, { status: 401, headers: NO_STORE });
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  try {
    return Response.json({ entries: await readAllEntries() }, { headers: NO_STORE });
  } catch (error) {
    console.error("Failed to read progress", error);
    return Response.json({ error: "database-error" }, { status: 500, headers: NO_STORE });
  }
}

export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: { key?: unknown; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  const { key, value } = body;
  if (typeof key !== "string" || !(SYNCED_KEYS as readonly string[]).includes(key)) {
    return Response.json({ error: "unknown-key" }, { status: 400 });
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return Response.json({ error: "invalid-value" }, { status: 400 });
  }
  if (JSON.stringify(value).length > MAX_VALUE_BYTES) {
    return Response.json({ error: "too-large" }, { status: 413 });
  }

  try {
    return Response.json({ updatedAt: await writeEntry(key, value) }, { headers: NO_STORE });
  } catch (error) {
    console.error("Failed to save progress", error);
    return Response.json({ error: "database-error" }, { status: 500, headers: NO_STORE });
  }
}
