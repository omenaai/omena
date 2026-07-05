import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TokenInputForm } from "@/components/app/TokenInputForm";
import { ExampleReportPreview, ModulePreviewGrid, RecentAnalysisPlaceholder } from "@/components/app/cards";
import { createMockAnalysis, demoTokenAddress } from "@/lib/intelligence/mock-analysis";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function DashboardHomePage() {
  const exampleResult = createMockAnalysis(demoTokenAddress);

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6">
      <section className="rounded-[28px] border border-border/70 bg-card/88 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium leading-6 text-muted-foreground">
              Run a token check, review the core signals, and jump into the full report without extra dashboard chrome.
            </p>
          </div>
          <Link
            href={`/app/analyze?token=${encodeURIComponent(demoTokenAddress)}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl bg-background text-[11px] font-black uppercase tracking-[0.18em]")}
          >
            Demo Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5">
          <TokenInputForm showHeader={false} />
        </div>
      </section>

      <ModulePreviewGrid />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <RecentAnalysisPlaceholder />
        <ExampleReportPreview result={exampleResult} />
      </div>
    </div>
  );
}
