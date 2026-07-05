import { NextResponse } from "next/server";

import { fetchLandingCoinPrices } from "@/lib/api/coingecko";

export async function GET() {
  const prices = await fetchLandingCoinPrices();

  return NextResponse.json(
    {
      prices,
      source: prices.some((coin) => coin.status === "live") ? "coingecko" : "fallback",
    },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
