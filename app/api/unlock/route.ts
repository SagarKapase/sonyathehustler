import { isSyncConfigured, passcodeMatches, startSession } from "@/lib/server/auth";

export async function POST(request: Request) {
  if (!isSyncConfigured()) return Response.json({ error: "sync-disabled" }, { status: 503 });

  let passcode: unknown;
  try {
    ({ passcode } = await request.json());
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  if (typeof passcode !== "string" || !passcodeMatches(passcode)) {
    // Slow down repeated guessing.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return Response.json({ error: "wrong-passcode" }, { status: 401 });
  }

  await startSession();
  return new Response(null, { status: 204 });
}
