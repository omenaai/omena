"use client";

import { useState } from "react";
import { AlertCircle, ArrowUpRight, Bot, Copy, Database, LineChart, ServerCog, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { TokenAnalysisResult } from "@/lib/types/token-analysis";

function formatCurrency(value: number | null) {
  if (value === null) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 4,
  }).format(value);
}

function formatPercent(value: number | null) {
  if (value === null) {
    return "Unavailable";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function getFriendlyReason(reason: string) {
  const normalized = reason.toLowerCase();

  if (normalized.includes("ollama") || normalized.includes("context")) {
    const detail = reason.split(":").slice(1).join(":").trim();
    return detail ? "AI summary is using fallback mode right now. Error: " + detail : "AI summary is using fallback mode right now.";
  }

  if (normalized.includes("helius") || normalized.includes("onchain")) {
    return "Some onchain details are limited right now.";
  }

  if (normalized.includes("dexscreener") || normalized.includes("market")) {
    return "Some market details are limited right now.";
  }

  return "Some parts of this report are limited right now.";
}

export function ModulePreviewGrid() {
  const items = [
    { title: "Risk", text: "Liquidity quality, market depth, token age, and caution flags.", icon: ShieldCheck },
    { title: "Behavior", text: "Holder versus trader behavior, deployer visibility, and flow bias.", icon: Wallet },
    { title: "Signals", text: "Momentum shifts, abnormal volume, and market condition severity.", icon: LineChart },
    { title: "Context", text: "Readable summary, verdict, and caution level.", icon: Sparkles },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="rounded-[24px] border border-border/70 bg-card/88 shadow-sm">
            <CardHeader className="gap-3 pb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-black tracking-[-0.03em]">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium leading-6 text-muted-foreground">{item.text}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function RecentAnalysisPlaceholder() {
  const rows = [
    { token: "BONK", status: "Watch", note: "Momentum improving, caution remains." },
    { token: "JUP", status: "Normal", note: "Deeper liquidity and cleaner signal mix." },
    { token: "WIF", status: "Alert", note: "High activity relative to liquidity." },
  ];

  return (
    <Card className="rounded-[24px] border border-border/70 bg-card/92 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-black tracking-[-0.03em]">Recent analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.token} className="flex items-center justify-between gap-4 rounded-[18px] border border-border/60 bg-background px-4 py-3">
            <div>
              <p className="text-sm font-black text-foreground">{row.token}</p>
              <p className="text-xs font-medium text-muted-foreground">{row.note}</p>
            </div>
            <Badge variant={row.status === "Alert" ? "destructive" : row.status === "Watch" ? "secondary" : "outline"}>{row.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ExampleReportPreview({ result }: { result: TokenAnalysisResult }) {
  return (
    <Card className="rounded-[24px] border border-border/70 bg-card/94 shadow-sm">
      <CardHeader className="gap-3 pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg font-black tracking-[-0.04em] text-foreground">{result.token.name} preview</CardTitle>
          <Badge className="bg-primary/10 text-primary">Demo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm font-medium text-muted-foreground">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <PreviewMetric label="Risk" value={`${result.risk.score}/100`} />
          <PreviewMetric label="Behavior" value={result.behavior.type} />
          <PreviewMetric label="Severity" value={result.signals.severity} />
          <PreviewMetric label="Caution" value={result.context.cautionLevel} />
        </div>
        <p className="max-w-3xl leading-6">{result.context.aiSummary}</p>
      </CardContent>
    </Card>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-border/70 bg-background px-3 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-sm font-black text-foreground">{value}</p>
    </div>
  );
}

export function TokenOverviewCard({ result }: { result: TokenAnalysisResult }) {
  const priceDeltaClass =
    (result.token.priceChange24hPct ?? 0) > 0 ? "text-primary" : (result.token.priceChange24hPct ?? 0) < 0 ? "text-[var(--color-error)]" : "text-foreground";

  return (
    <Card className="rounded-[24px] border border-border/70 bg-card/92 shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Token Overview</p>
            <h1 className="mt-2 font-display text-3xl font-black tracking-[-0.06em] text-foreground sm:text-4xl">
              {result.token.name} <span className="text-primary">({result.token.symbol})</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
              OMENA analyzes the latest live or fallback snapshot and keeps the report readable for non-technical users.
            </p>
          </div>
          <div className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/72">
            {result.meta.dataSource} data
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Price" value={formatCurrency(result.token.priceUsd)} />
        <MetricCard label="Liquidity" value={formatCurrency(result.token.liquidityUsd)} />
        <MetricCard label="24h Volume" value={formatCurrency(result.token.volume24hUsd)} />
        <MetricCard label="Market Cap" value={formatCurrency(result.token.marketCapUsd)} />
        <MetricCard label="24h Change" value={formatPercent(result.token.priceChange24hPct)} valueClassName={priceDeltaClass} />
      </CardContent>
    </Card>
  );
}

function MetricCard({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="rounded-[18px] border border-border/60 bg-background px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-base font-black text-foreground", valueClassName)}>{value}</p>
    </div>
  );
}

export function RiskCard({ result }: { result: TokenAnalysisResult }) {
  return <InsightCard title="Risk Intelligence" icon={ShieldCheck} badgeLabel={result.risk.level} badgeVariant={result.risk.level === "High" ? "destructive" : result.risk.level === "Medium" ? "secondary" : "outline"} summary={result.risk.summary} items={[`Score: ${result.risk.score}/100`, `Liquidity health: ${result.risk.liquidityHealth}`, `Holder concentration: ${result.risk.holderConcentration}`, ...result.risk.flags]} />;
}

export function BehaviorCard({ result }: { result: TokenAnalysisResult }) {
  return <InsightCard title="Behavior Intelligence" icon={Wallet} badgeLabel={result.behavior.type} badgeVariant="outline" summary={result.behavior.summary} items={[`Flow status: ${result.behavior.accumulationStatus}`, `Deployer visibility: ${result.behavior.deployerActivity}`, `Coverage: ${result.behavior.dataStatus}`, ...result.behavior.flags]} />;
}

export function SignalsCard({ result }: { result: TokenAnalysisResult }) {
  return <InsightCard title="Signal Intelligence" icon={LineChart} badgeLabel={result.signals.severity} badgeVariant={result.signals.severity === "Alert" ? "destructive" : result.signals.severity === "Watch" ? "secondary" : "outline"} summary={result.signals.summary} items={[`Momentum: ${result.signals.momentum}`, `Holder growth: ${result.signals.holderGrowth}`, ...result.signals.items]} />;
}

export function ContextCard({ result }: { result: TokenAnalysisResult }) {
  return <InsightCard title="Context Intelligence" icon={Sparkles} badgeLabel={`${result.context.cautionLevel} caution`} badgeVariant="secondary" summary={result.context.aiSummary} items={result.context.reportSections} />;
}

function InsightCard({ title, icon: Icon, badgeLabel, badgeVariant, summary, items }: { title: string; icon: typeof ShieldCheck; badgeLabel: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"; summary: string; items: string[]; }) {
  return (
    <Card className="rounded-[24px] border border-border/70 bg-card/92 shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
            <CardTitle className="text-lg font-black tracking-[-0.03em]">{title}</CardTitle>
          </div>
          <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium leading-6 text-muted-foreground">{summary}</p>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[18px] border border-border/60 bg-background px-4 py-3 text-sm font-medium text-foreground/88">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FinalVerdictCard({ result }: { result: TokenAnalysisResult }) {
  const [copied, setCopied] = useState(false);
  const reportText = [`${result.token.name} (${result.token.symbol})`, result.context.finalVerdict, result.context.aiSummary, ...result.context.reportSections].join("\n");

  return (
    <Card className="rounded-[28px] border border-primary/15 bg-primary/[0.045] shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">Final Verdict</p>
            <CardTitle className="mt-2 text-2xl font-black tracking-[-0.04em]">{result.context.finalVerdict}</CardTitle>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-background" onClick={async () => { await navigator.clipboard.writeText(reportText); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }}>
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy Report"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.45fr_0.9fr]">
        <div className="rounded-[24px] bg-card px-5 py-5 shadow-sm"><p className="text-sm font-medium leading-7 text-foreground/90">{result.context.aiSummary}</p></div>
        <div className="space-y-3">
          <StatusLine icon={Database} label="Source" value={result.meta.dataSource} />
          <StatusLine icon={ServerCog} label="Market" value={result.meta.sources.market} />
          <StatusLine icon={Wallet} label="Onchain" value={result.meta.sources.onchain} />
          <StatusLine icon={Bot} label="AI" value={result.meta.sources.context} />
          <StatusLine icon={AlertCircle} label="Status" value={result.status.replaceAll("_", " ")} />
          <StatusLine icon={ArrowUpRight} label="Caution" value={result.context.cautionLevel} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusLine({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-border/60 bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-black capitalize text-foreground">{value}</span>
    </div>
  );
}

export function EmptyAnalyzeState() {
  return (
    <Card className="rounded-[28px] border border-dashed border-border bg-card/90">
      <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <Badge variant="secondary" className="bg-primary/10 text-primary">Ready</Badge>
        <h2 className="font-display text-3xl font-black tracking-[-0.05em] text-foreground">Start with a token address.</h2>
        <p className="max-w-xl text-sm font-medium leading-6 text-muted-foreground">Use the analyzer form to open a report with risk, behavior, signal, and context modules.</p>
      </CardContent>
    </Card>
  );
}

export function ErrorAnalyzeState({ message }: { message: string }) {
  return (
    <Card className="rounded-[28px] border border-destructive/20 bg-destructive/10">
      <CardContent className="flex flex-col gap-3 px-6 py-10">
        <Badge variant="destructive" className="w-fit">Error</Badge>
        <h2 className="font-display text-2xl font-black tracking-[-0.04em] text-foreground">Analysis could not be generated.</h2>
        <p className="text-sm font-medium leading-6 text-foreground/80">{message || "The report is not available right now. Please try again."}</p>
      </CardContent>
    </Card>
  );
}

export function InsufficientDataBanner({ reasons }: { reasons: string[] }) {
  if (reasons.length === 0) return null;
  return (
    <div className="rounded-[24px] border border-border/70 bg-secondary/55 px-5 py-4 text-sm font-medium text-foreground/88">
      <div className="mb-2 flex items-center gap-2 font-black text-foreground"><AlertCircle className="h-4 w-4 text-primary" />Partial data notice</div>
      <div className="space-y-1.5">{reasons.map((reason) => <p key={reason}>{getFriendlyReason(reason)}</p>)}</div>
    </div>
  );
}

