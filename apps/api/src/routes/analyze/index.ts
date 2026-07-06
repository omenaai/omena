import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { internalAuth } from "../../middleware/internal-auth.js";
import { analyzeSchema } from "./schema.js";
import { handleAnalyze } from "./handler.js";

export const analyzeRoutes = new Hono()
  .post("/", internalAuth, zValidator("json", analyzeSchema), handleAnalyze);
