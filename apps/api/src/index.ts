import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) =>
  c.json({
    name: "omenaai-api",
    status: "ok",
    message: "API runtime online",
  }),
);

app.get("/health", (c) =>
  c.json({
    status: "ok",
    uptime: process.uptime(),
  }),
);

const port = Number(process.env.PORT ?? 8787);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`API ready at http://localhost:${info.port}`);
  },
);
