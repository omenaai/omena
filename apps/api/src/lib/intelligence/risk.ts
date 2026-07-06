import type { DexScreenerPair } from "../api/dexscreener.js";
import type { HeliusBehaviorSnapshot } from "../api/helius.js";
import type { RiskAnalysis } from "../types/token-analysis.js";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildRiskAnalysis(
  pair: DexScreenerPair | null,
  heliusSnapshot: HeliusBehaviorSnapshot,
): RiskAnalysis {
  if (!pair) {
    return {
      level: "High",
      score: 82,
      summary: "Live pair data is unavailable, so the token must be treated cautiously.",
      flags: ["No live liquidity pair was resolved from DexScreener."],
      liquidityHealth: "Unavailable",
      holderConcentration: heliusSnapshot.holderConcentrationLabel,
    };
  }

  const liquidity = pair.liquidity?.usd ?? 0;
  const volume = pair.volume?.h24 ?? 0;
  const buys = pair.txns?.h24?.buys ?? 0;
  const sells = pair.txns?.h24?.sells ?? 0;
  const ageHours = pair.pairCreatedAt ? (Date.now() - pair.pairCreatedAt) / 36e5 : null;

  let score = 50;
  const flags: string[] = [];

  if (liquidity < 25000) {
    score += 24;
    flags.push("Liquidity is still thin for reliable execution.");
  } else if (liquidity < 100000) {
    score += 12;
  } else {
    score -= 8;
  }

  if (liquidity > 0 && volume / liquidity > 1.8) {
    score += 10;
    flags.push("24h volume is high relative to current liquidity.");
  }

  if (ageHours !== null && ageHours < 72) {
    score += 10;
    flags.push("Pair is still new and lacks long observation history.");
  }

  if (sells > buys * 1.35 && sells > 40) {
    score += 8;
    flags.push("Selling activity is outpacing buys over the last 24 hours.");
  }

  if (heliusSnapshot.topHolderPercent !== null) {
    if (heliusSnapshot.topHolderPercent >= 20) {
      score += 12;
      flags.push(`Top holder controls ${heliusSnapshot.topHolderPercent}% of supply.`);
    } else if (heliusSnapshot.topHolderPercent >= 10) {
      score += 6;
    }
  }

  if (heliusSnapshot.top5HolderPercent !== null && heliusSnapshot.top5HolderPercent >= 60) {
    score += 8;
    flags.push(`Top five holders control ${heliusSnapshot.top5HolderPercent}% of supply.`);
  }

  if (heliusSnapshot.mintAuthority || heliusSnapshot.freezeAuthority) {
    score += 4;
    flags.push("Mint or freeze authority is still visible onchain.");
  }

  const normalizedScore = clampScore(score);
  const level = normalizedScore >= 70 ? "High" : normalizedScore >= 45 ? "Medium" : "Low";

  return {
    level,
    score: normalizedScore,
    summary:
      level === "Low"
        ? "Liquidity and holder structure look relatively stable for a watchlist token."
        : level === "Medium"
          ? "The token is analyzable, but concentration and early-stage market structure still require caution."
          : "Risk signals are elevated because liquidity or holder concentration remain fragile.",
    flags,
    liquidityHealth:
      liquidity >= 150000 ? "Healthy liquidity" : liquidity >= 50000 ? "Moderate liquidity" : "Thin liquidity",
    holderConcentration: heliusSnapshot.holderConcentrationLabel,
  };
}
