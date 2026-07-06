import { Hono } from "hono";
import { analyzeRoutes } from "./analyze/index.js";
import { marketRoutes } from "./market/index.js";

export const routes = new Hono()
  .route("/analyze", analyzeRoutes)
  .route("/market", marketRoutes);
