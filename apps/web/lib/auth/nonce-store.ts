import { randomUUID } from "node:crypto";
import { AUTH_NONCE_TTL_MS, AUTH_STATEMENT } from "@/lib/auth/config";

type NonceRecord = {
  walletAddress: string;
  nonce: string;
  issuedAt: string;
  expiresAt: number;
  domain: string;
  uri: string;
};

const nonceStore = new Map<string, NonceRecord>();

function cleanupExpiredNonces() {
  const now = Date.now();
  for (const [key, value] of nonceStore.entries()) {
    if (value.expiresAt <= now) {
      nonceStore.delete(key);
    }
  }
}

export function buildSignInMessage(record: Pick<NonceRecord, "walletAddress" | "nonce" | "issuedAt" | "domain" | "uri">) {
  return `${record.domain} wants you to sign in with your Solana account:\n${record.walletAddress}\n\n${AUTH_STATEMENT}\n\nURI: ${record.uri}\nVersion: 1\nNonce: ${record.nonce}\nIssued At: ${record.issuedAt}`;
}

export function createNonce(walletAddress: string, origin: string, domain: string) {
  cleanupExpiredNonces();

  const record: NonceRecord = {
    walletAddress,
    nonce: randomUUID(),
    issuedAt: new Date().toISOString(),
    expiresAt: Date.now() + AUTH_NONCE_TTL_MS,
    domain,
    uri: origin,
  };

  nonceStore.set(walletAddress, record);

  return {
    nonce: record.nonce,
    issuedAt: record.issuedAt,
    message: buildSignInMessage(record),
    expiresAt: new Date(record.expiresAt).toISOString(),
  };
}

export function consumeNonce(walletAddress: string) {
  cleanupExpiredNonces();
  const record = nonceStore.get(walletAddress);

  if (!record) {
    return null;
  }

  nonceStore.delete(walletAddress);

  if (record.expiresAt <= Date.now()) {
    return null;
  }

  return record;
}
