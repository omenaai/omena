import crypto from "node:crypto";
import path from "node:path";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { nextCookies } from "better-auth/next-js";

const DEFAULT_BETTER_AUTH_URL = "http://localhost:3000";
const DEFAULT_AUTH_DB_PATH = path.join(process.cwd(), "data", "auth.sqlite");
const BUILD_FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");
const isProduction = process.env.NODE_ENV === "production";

function getBetterAuthSecret() {
  const secret = process.env.BETTER_AUTH_SECRET?.trim() || process.env.AUTH_SESSION_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (isProduction) {
    throw new Error("BETTER_AUTH_SECRET or AUTH_SESSION_SECRET must be set in production.");
  }

  return BUILD_FALLBACK_SECRET;
}

function getBetterAuthBaseUrl() {
  const baseUrl = process.env.BETTER_AUTH_URL?.trim();

  if (baseUrl) {
    return baseUrl;
  }

  if (isProduction) {
    throw new Error("BETTER_AUTH_URL must be set in production.");
  }

  return DEFAULT_BETTER_AUTH_URL;
}

function getTrustedOrigins(baseURL: string) {
  const trustedOrigins = new Set<string>([baseURL]);
  const extraOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? [];

  for (const origin of extraOrigins) {
    const value = origin.trim();
    if (value) trustedOrigins.add(value);
  }

  if (!isProduction) {
    trustedOrigins.add("http://localhost:3000");
    trustedOrigins.add("http://127.0.0.1:3000");
  }

  return Array.from(trustedOrigins);
}

function createDatabase() {
  if (process.env.DATABASE_URL) {
    // PostgreSQL - used in production (EC2 / Docker)
    const { Pool } = require("pg") as typeof import("pg");
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }

  // SQLite - used in local development
  const fs = require("node:fs") as typeof import("fs");
  const Database = require("better-sqlite3") as typeof import("better-sqlite3");
  const dbPath = process.env.AUTH_DB_PATH?.trim() || DEFAULT_AUTH_DB_PATH;
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return new Database(dbPath);
}

const database = createDatabase();
const baseURL = getBetterAuthBaseUrl();

const betterAuthOptions: BetterAuthOptions = {
  database,
  secret: getBetterAuthSecret(),
  baseURL,
  trustedOrigins: getTrustedOrigins(baseURL),
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [nextCookies()],
};

export const emailAuth = betterAuth(betterAuthOptions);

let migrationPromise: Promise<void> | null = null;

export async function ensureBetterAuthSchema() {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      const { runMigrations } = await getMigrations(betterAuthOptions);
      await runMigrations();
    })().catch((error) => {
      migrationPromise = null;
      throw error;
    });
  }

  await migrationPromise;
}
