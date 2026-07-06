import { Hono } from "hono";
import { handleMarketPrices } from "./handler.js";

export const marketRoutes = new Hono()
  .get("/prices", handleMarketPrices);
