import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Shared-passcode access. Entering APP_PASSCODE once sets an httpOnly session
 * cookie; changing APP_PASSCODE signs everyone out.
 */

export const SESSION_COOKIE = "lr_session";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Sync needs both a database and a passcode; otherwise the app stays local-only. */
export function isSyncConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.APP_PASSCODE);
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

function sessionToken() {
  return createHash("sha256").update(`session:${process.env.APP_PASSCODE}`).digest("hex");
}

export function passcodeMatches(input: string) {
  const expected = process.env.APP_PASSCODE;
  return Boolean(expected) && safeEqual(input, expected!);
}

export async function isAuthenticated() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return Boolean(value && process.env.APP_PASSCODE) && safeEqual(value!, sessionToken());
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
}
