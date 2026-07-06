import type { TokenAnalysisResult } from "../types/token-analysis.js";

export const demoTokenAddress = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6JpwB7Lq9M4ePump";

export function createMockAnalysis(tokenAddress = demoTokenAddress): TokenAnalysisResult {
  return {
    status: "ok",
    token: {
      name: "Omena Signal",
      symbol: "OMSG",
      address: tokenAddress,
      chain: "Solana",
      priceUsd: 0.0184,
      liquidityUsd: 186400,
      volume24hUsd: 94800,
      marketCapUsd: 1840000,
      priceChange24hPct: 12.4,
      pairLabel: "OMSG / SOL",
      dexLabel: "Raydium",
    },
    risk: {
      level: "Medium",
      score: 58,
      summary: "Liquidity is workable, but concentration and token age still require caution.",
      flags: [
        "Top wallets appear concentrated relative to liquidity depth.",
        "Token is still early and needs more behavior history.",
      ],
      liquidityHealth: "Stable for a new pair",
      holderConcentration: "Moderately concentrated",
    },
    behavior: {
      type: "Mixed",
      summary: "Recent activity suggests a mix of early holders and short-term traders.",
      flags: [
        "Deployer behavior remains limited in public history.",
        "No strong smart-money classification available yet.",
      ],
      deployerActivity: "Limited but not clearly suspicious",
      accumulationStatus: "Balanced accumulation",
      dataStatus: "partial",
    },
    signals: {
      severity: "Watch",
      summary: "Volume and price momentum are improving, but not enough to remove caution.",
      items: [
        "24h volume is rising faster than liquidity.",
        "Price trend is positive over the last 24 hours.",
        "Current move should be monitored for sustainability.",
      ],
      momentum: "Positive but early",
      holderGrowth: "Insufficient live holder data",
    },
    context: {
      aiSummary:
        "OMENA classifies this token as a developing Solana pair with usable liquidity, early traction, and incomplete behavioral coverage. It is not immediately critical, but it should be monitored rather than trusted blindly.",
      finalVerdict:
        "Proceed with caution. The token is analyzable and active, but the available data still favors a medium-risk stance.",
      cautionLevel: "Medium",
      reportSections: [
        "Token overview: early Solana pair with visible market activity.",
        "Risk summary: medium due to concentration and limited history.",
        "Behavior summary: mixed holder and trader behavior with partial data.",
        "Signal summary: improving momentum, but not fully confirmed.",
      ],
    },
    meta: {
      dataSource: "mock",
      generatedAt: new Date().toISOString(),
      insufficientDataReasons: ["Holder and deployer intelligence are using placeholder assumptions."],
      sources: {
        market: "mock",
        onchain: "mock",
        context: "rule-based",
      },
      coverage: {
        risk: "partial",
        behavior: "partial",
        signals: "partial",
        context: "partial",
      },
    },
  };
}
