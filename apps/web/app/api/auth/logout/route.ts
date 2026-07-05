import { NextResponse } from "next/server";
import { emailAuth, ensureBetterAuthSchema } from "@/lib/auth/better-auth";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  await clearSessionCookie();

  try {
    await ensureBetterAuthSchema();
    await emailAuth.api.signOut({
      headers: request.headers,
    });
  } catch {
    // Ignore Better Auth sign-out failures here.
  }

  return NextResponse.json({ ok: true });
}
