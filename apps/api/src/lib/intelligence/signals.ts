import type { DexScreenerPair } from "../api/dexscreener.js";
import type { HeliusBehaviorSnapshot } from "../api/helius.js";
import type { SignalAnalysis } from "../types/token-analysis.js";

export function buildSignalAnalysis(
  pair: DexScreenerPair | null,
  heliusSnapshot: HeliusBehaviorSnapshot,
): SignalAnalysis {
  if (!pair) {
    return {
      severity: "Alert",
      summary: "Signal coverage is degraded because live market data is unavailable.",
      items: ["No live pair data to measure market changes."],
      momentum: "Unknown",
      holderGrowth: heliusSnapshot.holderGrowth,
    };
  }

  const priceChange = pair.priceChange?.h24 ?? 0;
  const volume = pair.volume?.h24 ?? 0;
  const liquidity = pair.liquidity?.usd ?? 0;
  const buys = pair.txns?.h24?.buys ?? 0;
  const sells = pair.txns?.h24?.sells ?? 0;

  const items: string[] = [];
  let severity: SignalAnalysis["severity"] = "Normal";

  if (Math.abs(priceChange) >= 20) {
    severity = "Watch";
    items.push("24h price movement is materially elevated.");
  }

  if (liquidity > 0 && volume / liquidity > 2.2) {
    severity = "Alert";
    items.push("Trading volume is outsized relative to current liquidity.");
  }

  if (buys > sells * 1.4 && buys > 50) {
    items.push("Buy-side transaction flow is accelerating.");
  } else if (sells > buys * 1.4 && sells > 50) {
    severity = severity === "Alert" ? "Alert" : "Watch";
    items.push("Sell-side flow is accelerating faster than buys.");
  }

  if (heliusSnapshot.walletActivitySummary !== "Large-holder wallet activity unavailable.") {
    items.push(heliusSnapshot.walletActivitySummary);
  }

  if (heliusSnapshot.behaviorBias === "distributing") {
    severity = severity === "Alert" ? "Alert" : "Watch";
    items.push("Tracked large-holder wallets lean toward distribution.");
  }

  if (items.length === 0) {
    items.push("Market activity looks stable on the current snapshot.");
  }

  return {
    severity,
    summary:
      severity === "Normal"
        ? "No abnormal market activity stands out on the latest market and onchain snapshot."
        : severity === "Watch"
          ? "The token is showing notable market or wallet changes that deserve monitoring."
          : "Current activity is sharp enough to treat as a live alert condition.",
    items,
    momentum: priceChange >= 8 ? "Positive" : priceChange <= -8 ? "Negative" : "Flat to mixed",
    holderGrowth: heliusSnapshot.holderGrowth,
  };
}
