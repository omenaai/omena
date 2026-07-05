export type LandingCoinPrice = {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number | null;
  status: "live" | "fallback";
};

const LANDING_COINS = [
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "raydium", name: "Raydium", symbol: "RAY" },
  { id: "orca", name: "Orca", symbol: "ORCA" },
] as const;

const FALLBACK_PRICES: Record<string, number> = {
  solana: 142.5,
  ethereum: 3450,
  raydium: 1.85,
  orca: 2.9,
};

export async function fetchLandingCoinPrices(): Promise<LandingCoinPrice[]> {
  const ids = LANDING_COINS.map((coin) => coin.id).join(",");
  const apiKey = process.env.COINGECKO_API_KEY;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      {
        headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error(`CoinGecko request failed with ${response.status}`);
    }

    const data = (await response.json()) as Record<string, { usd?: number }>;

    return LANDING_COINS.map((coin): LandingCoinPrice => {
      const livePrice = data[coin.id]?.usd;

      return {
        ...coin,
        priceUsd: typeof livePrice === "number" ? livePrice : FALLBACK_PRICES[coin.id] ?? null,
        status: typeof livePrice === "number" ? "live" : "fallback",
      };
    });
  } catch {
    return LANDING_COINS.map((coin): LandingCoinPrice => ({
      ...coin,
      priceUsd: FALLBACK_PRICES[coin.id] ?? null,
      status: "fallback",
    }));
  }
}
