import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  LineChart,
  ScanSearch,
  Settings,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { TokenInputForm } from "@/components/app/TokenInputForm";
import { buttonVariants } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type RecentAnalysis = {
  token: string;
  status: string;
  summary: string;
};

const featureAccents: Record<string, string> = {
  "Risk Scan": "border-l-rose-500 bg-rose-500/5",
  "Behavior": "border-l-violet-500 bg-violet-500/5",
  "Signals": "border-l-sky-500 bg-sky-500/5",
  "Reports": "border-l-emerald-500 bg-emerald-500/5",
};

const featureIconColors: Record<string, string> = {
  "Risk Scan": "bg-rose-500/10 text-rose-500",
  "Behavior": "bg-violet-500/10 text-violet-500",
  "Signals": "bg-sky-500/10 text-sky-500",
  "Reports": "bg-emerald-500/10 text-emerald-500",
};

const statusColors: Record<string, string> = {
  Online: "bg-emerald-500",
  Ready: "bg-sky-500",
  Waiting: "bg-amber-500",
  Offline: "bg-rose-500",
};

export default function DashboardHomePage() {
  const features = [
    {
      title: "Risk Scan",
      text: "Liquidity, holder concentration, age, and caution flags.",
      icon: ShieldCheck,
      status: "Live",
    },
    {
      title: "Behavior",
      text: "Wallet flow, deployer activity, and holder movement.",
      icon: Wallet,
      status: "Live",
    },
    {
      title: "Signals",
      text: "Momentum, volume shifts, and abnormal market activity.",
      icon: LineChart,
      status: "Live",
    },
    {
      title: "Reports",
      text: "Readable verdicts for token review and team sharing.",
      icon: BookOpen,
      status: "Ready",
    },
  ];

  const activity = [
    { label: "Risk engine", value: "Online" },
    { label: "Market source", value: "Ready" },
    { label: "Onchain source", value: "Ready" },
  ];

  const recentAnalyses: RecentAnalysis[] = [];

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-2 pb-8 md:px-4 lg:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card/90 shadow-[var(--shadow-ambient)]">
        {/* decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/8 blur-3xl"
        />
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8">
            <div className="flex max-w-3xl flex-col gap-1.5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Command Center
              </p>
              <h1 className="font-display text-3xl font-black tracking-[-0.06em] text-foreground sm:text-4xl">
                Dashboard
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Monitor token checks, review active modules, and start a new analysis.
              </p>
            </div>
            <div className="mt-6">
              <TokenInputForm showHeader={false} />
            </div>
          </div>
          <div className="border-t border-border/70 bg-secondary/55 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              System Status
            </p>
            {activity.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {activity.map((item) => {
                  const dotColor = statusColors[item.value] ?? "bg-border";
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-3"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-sm font-black text-foreground">{item.value}</p>
                      </div>
                      <span className="relative flex h-2.5 w-2.5">
                        <span
                          className={cn(
                            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                            dotColor,
                          )}
                        />
                        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", dotColor)} />
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                className="min-h-[168px] bg-background/70"
                icon={Settings}
                title="System status unavailable."
                description="Status checks will appear here when sources respond."
              />
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        {/* Feature cards with per-module color accent */}
        <section className="grid gap-3 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const accent = featureAccents[feature.title] ?? "";
            const iconColor = featureIconColors[feature.title] ?? "bg-primary/10 text-primary";

            return (
              <Card
                key={feature.title}
                className={cn(
                  "min-h-[216px] rounded-[24px] border border-border/70 border-l-[3px] shadow-sm",
                  accent,
                )}
              >
                <CardHeader className="gap-4 pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconColor)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-black tracking-[-0.03em]">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium leading-6 text-muted-foreground">{feature.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <aside className="flex flex-col gap-5">
          <Card className="rounded-[24px] border border-border/70 bg-card/92 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black tracking-[-0.03em]">Next actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link
                href="/app/analyze"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full justify-between rounded-2xl text-sm font-bold",
                )}
              >
                New analysis
                <ScanSearch className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full justify-between rounded-2xl bg-background text-sm font-bold",
                )}
              >
                Documentation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/app/settings"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full justify-between rounded-2xl bg-background text-sm font-bold",
                )}
              >
                Settings
                <Settings className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border border-border/70 bg-card/92 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black tracking-[-0.03em]">Recent analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length > 0 ? (
                <div className="space-y-2.5">
                  {recentAnalyses.map((report) => (
                    <div
                      key={report.token}
                      className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-foreground">{report.token}</p>
                        <Badge variant="outline">{report.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{report.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  className="min-h-[132px]"
                  icon={FileText}
                  title="No saved reports yet."
                  description="Run an analysis to populate this list."
                />
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function EmptyState({
  className,
  description,
  icon: Icon,
  title,
}: {
  className?: string;
  description: string;
  icon: typeof FileText;
  title: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/70 px-4 py-8 text-center",
        className,
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1 max-w-[260px] text-xs font-medium leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}
