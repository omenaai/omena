import type { Context } from "hono";
import { fetchLandingCoinPrices } from "../../lib/api/coingecko.js";

let cache: { data: Awaited<ReturnType<typeof fetchLandingCoinPrices>>; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

export async function handleMarketPrices(c: Context) {
  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return c.json({
      prices: cache.data,
      source: cache.data.some((coin) => coin.status === "live") ? "coingecko" : "fallback",
      cached: true,
    });
  }

  const prices = await fetchLandingCoinPrices();
  cache = { data: prices, expiresAt: now + CACHE_TTL_MS };

  return c.json({
    prices,
    source: prices.some((coin) => coin.status === "live") ? "coingecko" : "fallback",
    cached: false,
  });
}
