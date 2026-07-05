export const AUTH_COOKIE_NAME = "omena_session";
export const AUTH_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const AUTH_NONCE_TTL_MS = 1000 * 60 * 5;
export const AUTH_ISSUER = "omenaai";
export const AUTH_AUDIENCE = "omena-dashboard";
export const AUTH_STATEMENT = "Sign in to OMENA Dashboard.";
export const DEFAULT_SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";

export function getAuthSecret() {
  const secret = process.env.AUTH_SESSION_SECRET?.trim();

  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export function getSolanaRpcUrl() {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim() || DEFAULT_SOLANA_RPC_URL;
}
