import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies, headers } from "next/headers";
import { AUTH_AUDIENCE, AUTH_COOKIE_NAME, AUTH_ISSUER, AUTH_SESSION_TTL_SECONDS, getAuthSecret } from "@/lib/auth/config";
import { emailAuth, ensureBetterAuthSchema } from "@/lib/auth/better-auth";

export type AuthSession = {
  userId: string;
  provider: "wallet" | "email";
  walletAddress: string | null;
  email: string | null;
  name: string | null;
  issuedAt: number;
  expiresAt: number;
};

type SessionClaims = JWTPayload & {
  uid: string;
  walletAddress: string;
};

function toUnixTimestamp(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000);
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
  }

  return 0;
}

function buildWalletSessionFromClaims(payload: SessionClaims): AuthSession {
  return {
    userId: payload.uid,
    provider: "wallet",
    walletAddress: payload.walletAddress,
    email: null,
    name: null,
    issuedAt: payload.iat ?? 0,
    expiresAt: payload.exp ?? 0,
  };
}

export async function createSessionToken(walletAddress: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + AUTH_SESSION_TTL_SECONDS;

  const token = await new SignJWT({
    uid: `wallet:${walletAddress}`,
    walletAddress,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(issuedAt)
    .setIssuer(AUTH_ISSUER)
    .setAudience(AUTH_AUDIENCE)
    .setExpirationTime(expiresAt)
    .sign(getAuthSecret());

  return {
    token,
    session: {
      userId: `wallet:${walletAddress}`,
      provider: "wallet",
      walletAddress,
      email: null,
      name: null,
      issuedAt,
      expiresAt,
    } satisfies AuthSession,
  };
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret(), {
    issuer: AUTH_ISSUER,
    audience: AUTH_AUDIENCE,
  });

  return buildWalletSessionFromClaims(payload as SessionClaims);
}

async function getWalletRequestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

async function getEmailRequestSession() {
  await ensureBetterAuthSchema();

  const requestHeaders = await headers();
  const session = await emailAuth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return null;
  }

  return {
    userId: session.user.id,
    provider: "email",
    walletAddress: null,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
    issuedAt: toUnixTimestamp(session.session.createdAt),
    expiresAt: toUnixTimestamp(session.session.expiresAt),
  } satisfies AuthSession;
}

export async function getRequestSession() {
  const walletSession = await getWalletRequestSession();

  if (walletSession) {
    return walletSession;
  }

  try {
    return await getEmailRequestSession();
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
