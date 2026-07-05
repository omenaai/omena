import { NextResponse } from "next/server";
import { createSessionToken, getRequestSession, setSessionCookie } from "@/lib/auth/session";

export async function GET() {
  const session = await getRequestSession();

  if (!session) {
    return NextResponse.json({ session: null }, { status: 401 });
  }

  if (session.provider === "wallet" && session.walletAddress) {
    const refreshed = await createSessionToken(session.walletAddress);
    await setSessionCookie(refreshed.token);
    return NextResponse.json({ session: refreshed.session });
  }

  return NextResponse.json({ session });
}
