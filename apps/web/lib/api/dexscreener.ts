type DexScreenerToken = {
  address?: string;
  name?: string;
  symbol?: string;
};

export type DexScreenerPair = {
  chainId?: string;
  dexId?: string;
  pairAddress?: string;
  baseToken?: DexScreenerToken;
  quoteToken?: DexScreenerToken;
  priceUsd?: string;
  fdv?: number;
  marketCap?: number;
  liquidity?: {
    usd?: number;
  };
  volume?: {
    h24?: number;
  };
  priceChange?: {
    h24?: number;
  };
  pairCreatedAt?: number;
  txns?: {
    h24?: {
      buys?: number;
      sells?: number;
    };
  };
};

type DexScreenerResponse = {
  pairs?: DexScreenerPair[];
};

export async function fetchDexScreenerPairs(tokenAddress: string) {
  const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`DexScreener request failed: ${response.status}`);
  }

  const payload = (await response.json()) as DexScreenerResponse;
  return payload.pairs ?? [];
}

export function pickPrimaryPair(pairs: DexScreenerPair[]) {
  return [...pairs].sort((left, right) => {
    const leftLiquidity = left.liquidity?.usd ?? 0;
    const rightLiquidity = right.liquidity?.usd ?? 0;

    if (leftLiquidity !== rightLiquidity) {
      return rightLiquidity - leftLiquidity;
    }

    return (right.volume?.h24 ?? 0) - (left.volume?.h24 ?? 0);
  })[0] ?? null;
}
