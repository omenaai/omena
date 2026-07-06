import { fetchDexScreenerPairs, pickPrimaryPair } from "../api/dexscreener.js";
import { fetchHeliusBehaviorSnapshot } from "../api/helius.js";
import { generateOllamaContextSummary } from "../api/ollama.js";
import { buildBehaviorAnalysis } from "./behavior.js";
import { buildContextAnalysis } from "./context.js";
import { createMockAnalysis } from "./mock-analysis.js";
import { buildRiskAnalysis } from "./risk.js";
import { buildSignalAnalysis } from "./signals.js";
import { validateSolanaTokenAddress } from "./validation.js";
import type { AnalyzeTokenOptions, TokenAnalysisResult, TokenOverview } from "../types/token-analysis.js";

function buildOverview(tokenAddress: string, pair: ReturnType<typeof pickPrimaryPair>): TokenOverview {
  return {
    name: pair?.baseToken?.name ?? "Unknown token",
    symbol: pair?.baseToken?.symbol ?? "UNKNOWN",
    address: tokenAddress,
    chain: "Solana",
    priceUsd: pair?.priceUsd ? Number(pair.priceUsd) : null,
    liquidityUsd: pair?.liquidity?.usd ?? null,
    volume24hUsd: pair?.volume?.h24 ?? null,
    marketCapUsd: pair?.marketCap ?? pair?.fdv ?? null,
    priceChange24hPct: pair?.priceChange?.h24 ?? null,
    pairLabel: `${pair?.baseToken?.symbol ?? "TOKEN"} / ${pair?.quoteToken?.symbol ?? "PAIR"}`,
    dexLabel: pair?.dexId ? pair.dexId.toUpperCase() : "Unknown DEX",
  };
}

export async function analyzeTokenAddress(
  tokenAddress: string,
  options: AnalyzeTokenOptions = {},
): Promise<TokenAnalysisResult> {
  const validation = validateSolanaTokenAddress(tokenAddress);

  if (!validation.ok) {
    throw new Error(validation.message);
  }

  if (options.forceMock) {
    return createMockAnalysis(validation.value);
  }

  try {
    const [pairs, heliusSnapshot] = await Promise.all([
      fetchDexScreenerPairs(validation.value),
      fetchHeliusBehaviorSnapshot(validation.value),
    ]);
    const primaryPair = pickPrimaryPair(pairs);

    if (!primaryPair) {
      const mock = createMockAnalysis(validation.value);
      return {
        ...mock,
        status: "insufficient_data",
        meta: {
          ...mock.meta,
          dataSource: "mixed",
          insufficientDataReasons: ["DexScreener did not return a usable liquidity pair."],
          sources: {
            market: "mock",
            onchain: heliusSnapshot.available ? "helius" : "missing",
            context: "rule-based",
          },
          coverage: {
            risk: "partial",
            behavior: heliusSnapshot.coverage,
            signals: "partial",
            context: "partial",
          },
        },
      };
    }

    const token = buildOverview(validation.value, primaryPair);
    const risk = buildRiskAnalysis(primaryPair, heliusSnapshot);
    const behavior = buildBehaviorAnalysis(primaryPair, heliusSnapshot);
    const signals = buildSignalAnalysis(primaryPair, heliusSnapshot);

    const insufficientDataReasons = [...heliusSnapshot.notes];
    const ruleBasedContext = buildContextAnalysis({
      token,
      risk,
      behavior,
      signals,
      dataQualityNotes: insufficientDataReasons,
    });

    let context = ruleBasedContext;
    let contextSource: TokenAnalysisResult["meta"]["sources"]["context"] = "rule-based";
    let contextCoverage: TokenAnalysisResult["meta"]["coverage"]["context"] = "partial";

    try {
      const aiSummary = await generateOllamaContextSummary({
        token,
        risk,
        behavior,
        signals,
        dataQualityNotes: insufficientDataReasons,
      });
      context = {
        ...ruleBasedContext,
        aiSummary,
      };
      contextSource = "ollama";
      contextCoverage = "complete";
    } catch (error) {
      insufficientDataReasons.push(
        error instanceof Error
          ? `Ollama fallback in use: ${error.message}`
          : "Ollama fallback in use because the local model did not respond.",
      );
    }

    const marketSource: TokenAnalysisResult["meta"]["sources"]["market"] = "dexscreener";
    const onchainSource: TokenAnalysisResult["meta"]["sources"]["onchain"] = heliusSnapshot.available ? "helius" : "missing";
    const dataSource =
      marketSource === "dexscreener" && onchainSource === "helius" && contextSource === "ollama"
        ? "live"
        : "mixed";

    return {
      status: insufficientDataReasons.length === 0 ? "ok" : "insufficient_data",
      token,
      risk,
      behavior,
      signals,
      context,
      meta: {
        dataSource,
        generatedAt: new Date().toISOString(),
        insufficientDataReasons,
        sources: {
          market: marketSource,
          onchain: onchainSource,
          context: contextSource,
        },
        coverage: {
          risk: heliusSnapshot.available ? "complete" : "partial",
          behavior: heliusSnapshot.coverage,
          signals: heliusSnapshot.coverage === "missing" ? "partial" : heliusSnapshot.coverage,
          context: contextCoverage,
        },
      },
    };
  } catch {
    const mock = createMockAnalysis(validation.value);
    return {
      ...mock,
      status: "insufficient_data",
      meta: {
        ...mock.meta,
        dataSource: "mixed",
        insufficientDataReasons: ["Live market data is unavailable, so OMENA is showing the fallback analysis."],
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
}
