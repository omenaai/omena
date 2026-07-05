export type RiskLevel = "Low" | "Medium" | "High";
export type SignalSeverity = "Normal" | "Watch" | "Alert";
export type CautionLevel = "Low" | "Medium" | "High";
export type AnalysisCoverage = "complete" | "partial" | "missing";
export type BehaviorType =
  | "Holder-heavy"
  | "Trader-heavy"
  | "Whale-driven"
  | "Mixed"
  | "Unknown";

export type AnalysisStatus = "ok" | "insufficient_data" | "error";

export type TokenOverview = {
  name: string;
  symbol: string;
  address: string;
  chain: string;
  priceUsd: number | null;
  liquidityUsd: number | null;
  volume24hUsd: number | null;
  marketCapUsd: number | null;
  priceChange24hPct: number | null;
  pairLabel: string;
  dexLabel: string;
};

export type RiskAnalysis = {
  level: RiskLevel;
  score: number;
  summary: string;
  flags: string[];
  liquidityHealth: string;
  holderConcentration: string;
};

export type BehaviorAnalysis = {
  type: BehaviorType;
  summary: string;
  flags: string[];
  deployerActivity: string;
  accumulationStatus: string;
  dataStatus: AnalysisCoverage;
};

export type SignalAnalysis = {
  severity: SignalSeverity;
  summary: string;
  items: string[];
  momentum: string;
  holderGrowth: string;
};

export type ContextAnalysis = {
  aiSummary: string;
  finalVerdict: string;
  cautionLevel: CautionLevel;
  reportSections: string[];
};

export type TokenAnalysisResult = {
  status: AnalysisStatus;
  token: TokenOverview;
  risk: RiskAnalysis;
  behavior: BehaviorAnalysis;
  signals: SignalAnalysis;
  context: ContextAnalysis;
  meta: {
    dataSource: "mock" | "live" | "mixed";
    generatedAt: string;
    insufficientDataReasons: string[];
    sources: {
      market: "dexscreener" | "mock";
      onchain: "helius" | "missing" | "mock";
      context: "ollama" | "rule-based";
    };
    coverage: {
      risk: AnalysisCoverage;
      behavior: AnalysisCoverage;
      signals: AnalysisCoverage;
      context: AnalysisCoverage;
    };
  };
};

export type AnalyzeTokenOptions = {
  forceMock?: boolean;
};
