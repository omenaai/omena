import { ScanSearch, Terminal } from "lucide-react";
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
import { analyzeTokenAddress } from "@/lib/intelligence/analyze-token";

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
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-0 px-2 pb-8 md:px-4 lg:px-6">
        {/* Terminal header */}
        <div className="relative overflow-hidden rounded-t-[28px] border border-b-0 border-border/70 bg-[#0d1117] px-6 py-5 sm:px-8">
          {/* scanline overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,128,0.015)_2px,rgba(0,255,128,0.015)_4px)]"
          />
          <div className="relative flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/60">
                omena-agent — token scanner
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-black tracking-[-0.06em] text-white sm:text-3xl">
                  Analyze
                </h1>
                <p className="text-xs font-medium text-emerald-400/70">
                  Paste a Solana token address to run a structured intelligence report.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="rounded-b-[28px] border border-t border-border/70 bg-card/90 p-6 shadow-[var(--shadow-ambient)] sm:p-8">
          <TokenInputForm showHeader={false} />
        </div>

        {/* Empty state */}
        <div className="mt-5">
          <EmptyAnalyzeState />
        </div>
      </div>
    );
  }

  let result: Awaited<ReturnType<typeof analyzeTokenAddress>> | null = null;
  let errorMessage = "";

  try {
    result = await analyzeTokenAddress(token);
  } catch (error) {
    errorMessage = getFriendlyAnalyzeError(error instanceof Error ? error.message : undefined);
  }

  if (!result) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-0 px-2 pb-8 md:px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-t-[28px] border border-b-0 border-border/70 bg-[#0d1117] px-6 py-5 sm:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,128,0.015)_2px,rgba(0,255,128,0.015)_4px)]"
          />
          <div className="relative flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400/70">
              omena-agent — error
            </span>
          </div>
        </div>
        <div className="rounded-b-[28px] border border-t border-border/70 bg-card/90 p-6 shadow-[var(--shadow-ambient)] sm:p-8">
          <TokenInputForm defaultValue={token} showHeader={false} />
        </div>
        <div className="mt-5">
          <ErrorAnalyzeState message={errorMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-0 px-2 pb-8 md:px-4 lg:px-6">
      {/* Terminal header with token address */}
      <div className="relative overflow-hidden rounded-t-[28px] border border-b-0 border-border/70 bg-[#0d1117] px-6 py-5 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,128,0.015)_2px,rgba(0,255,128,0.015)_4px)]"
        />
        <div className="relative flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-[10px] tracking-wide text-emerald-400/60">
            $ omena analyze{" "}
            <span className="text-emerald-400">{token}</span>
          </span>
        </div>
        <div className="relative mt-3 flex items-center gap-2">
          <ScanSearch className="h-4 w-4 text-emerald-400" />
          <span className="font-mono text-xs font-bold text-emerald-400">Report ready</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Input bar */}
      <div className="border border-t border-border/70 bg-card/90 px-6 py-4 sm:px-8">
        <TokenInputForm defaultValue={token} showHeader={false} />
      </div>

      {/* Results */}
      <div className="rounded-b-[28px] border border-t-0 border-border/70 bg-card/90 p-6 shadow-[var(--shadow-ambient)] sm:p-8">
        <InsufficientDataBanner reasons={result.meta.insufficientDataReasons} />
        <div className="mt-4 flex flex-col gap-6">
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
    </div>
  );
}
