import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { routes } from "./routes/index.js";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

const app = new Hono();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: (origin) => (ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]),
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  }),
);

app.get("/", (c) =>
  c.json({
    name: "omenaai-api",
    version: "0.1.0",
    status: "ok",
  }),
);

app.get("/health", (c) =>
  c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }),
);

app.route("/", routes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ success: false, message: err.message }, err.status);
  }
  console.error(err);
  return c.json({ success: false, message: "Internal server error" }, 500);
});

app.notFound((c) => c.json({ success: false, message: "Route not found" }, 404));

const port = Number(process.env.PORT ?? 8787);

serve(
  { fetch: app.fetch, port },
  (info) => {
    console.log(`[api] ready → http://localhost:${info.port}`);
    console.log(`[api] allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
  },
);
