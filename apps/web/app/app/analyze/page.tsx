import { ScanSearch } from "lucide-react";
import { TokenInputForm } from "@/components/app/TokenInputForm";
import {
  BehaviorCard,
  ContextCard,
  EmptyAnalyzeState,
  ErrorAnalyzeState,
  FinalVerdictCard,
  InsufficientDataBanner,
  RiskCard,
  SignalsCard,
  TokenOverviewCard,
} from "@/components/app/cards";
import type { TokenAnalysisResult } from "@/lib/types/token-analysis";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8787";

async function fetchAnalysis(tokenAddress: string): Promise<TokenAnalysisResult> {
  const res = await fetch(`${API_INTERNAL_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.INTERNAL_API_SECRET
        ? { Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}` }
        : {}),
    },
    body: JSON.stringify({ tokenAddress }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Analysis request failed: ${res.status}`);
  }

  return res.json() as Promise<TokenAnalysisResult>;
}

type AnalyzePageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

function getFriendlyAnalyzeError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";
  if (normalized.includes("unauthorized")) return "Please sign in to continue.";
  if (normalized.includes("required") || normalized.includes("invalid"))
    return "Please enter a valid Solana token address.";
  return "The report is not available right now. Please try again.";
}

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;
  const token = params.token?.trim();

  if (!token) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1.5 pt-4">
          <h1 className="font-display text-3xl font-black tracking-[-0.06em] text-foreground sm:text-4xl">
            Analyze
          </h1>
          <p className="text-sm font-semibold text-muted-foreground">
            Paste a Solana token address to run a structured intelligence report.
          </p>
        </div>

        {/* Input area */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
          <TokenInputForm showHeader={false} />
        </div>

        {/* Empty state */}
        <div>
          <EmptyAnalyzeState />
        </div>
      </div>
    );
  }

  let result: TokenAnalysisResult | null = null;
  let errorMessage = "";

  try {
    result = await fetchAnalysis(token);
  } catch (error) {
    errorMessage = getFriendlyAnalyzeError(error instanceof Error ? error.message : undefined);
  }

  if (!result) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1.5 pt-4">
          <h1 className="font-display text-3xl font-black tracking-[-0.06em] text-foreground sm:text-4xl">
            Analyze Error
          </h1>
          <p className="text-sm font-semibold text-muted-foreground">
            Something went wrong during token verification.
          </p>
        </div>

        {/* Input area */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm sm:p-8">
          <TokenInputForm defaultValue={token} showHeader={false} />
        </div>

        <div>
          <ErrorAnalyzeState message={errorMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-8 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 pt-4">
        <h1 className="font-display text-3xl font-black tracking-[-0.06em] text-foreground sm:text-4xl">
          Report Ready
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">
          Detailed analysis for Solana token: <span className="font-mono text-primary font-bold">{token}</span>
        </p>
      </div>

      {/* Input bar */}
      <div className="rounded-2xl border border-border/50 bg-card px-6 py-4 shadow-sm">
        <TokenInputForm defaultValue={token} showHeader={false} />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-6">
        <InsufficientDataBanner reasons={result.meta.insufficientDataReasons} />
        <TokenOverviewCard result={result} />
        <div className="grid gap-6 xl:grid-cols-2">
          <RiskCard result={result} />
          <BehaviorCard result={result} />
          <SignalsCard result={result} />
          <ContextCard result={result} />
        </div>
        <FinalVerdictCard result={result} />
      </div>
    </div>
  );
}
