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

  if (normalized.includes("unauthorized")) {
    return "Please sign in to continue.";
  }

  if (normalized.includes("required") || normalized.includes("invalid")) {
    return "Please enter a valid Solana token address.";
  }

  return "The report is not available right now. Please try again.";
}

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;
  const token = params.token?.trim();

  if (!token) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-10 md:py-14">
        <TokenInputForm showHeader={false} />
        <EmptyAnalyzeState />
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
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-10 md:py-14">
        <TokenInputForm defaultValue={token} showHeader={false} />
        <ErrorAnalyzeState message={errorMessage} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10 md:py-14">
      <TokenInputForm defaultValue={token} showHeader={false} />
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
  );
}
