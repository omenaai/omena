import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Eye,
  LineChart,
  Search,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type MarketTab = "overview" | "top-tokens" | "trending" | "watchlist";

type MarketPageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

const tabs: Array<{
  value: MarketTab;
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  { value: "overview", label: "Overview", href: "/app/market", icon: TrendingUp },
  { value: "top-tokens", label: "Top Tokens", href: "/app/market?tab=top-tokens", icon: BarChart3 },
  { value: "trending", label: "Trending", href: "/app/market?tab=trending", icon: LineChart },
  { value: "watchlist", label: "Watchlist", href: "/app/market?tab=watchlist", icon: Star },
];

const emptyStateByTab: Record<
  MarketTab,
  { title: string; description: string; icon: LucideIcon; actionLabel: string; actionHref: string }
> = {
  overview: {
    title: "Market overview is empty.",
    description: "Token market data will appear here when market sources return results.",
    icon: TrendingUp,
    actionLabel: "Run analysis",
    actionHref: "/app/analyze",
  },
  "top-tokens": {
    title: "No top tokens yet.",
    description: "Ranked tokens will appear here after market snapshots are available.",
    icon: BarChart3,
    actionLabel: "Analyze token",
    actionHref: "/app/analyze",
  },
  trending: {
    title: "No trending tokens yet.",
    description: "Momentum candidates will appear here when enough activity is detected.",
    icon: LineChart,
    actionLabel: "Check token",
    actionHref: "/app/analyze",
  },
  watchlist: {
    title: "Watchlist is empty.",
    description: "Saved tokens will appear here once watchlist storage is connected.",
    icon: Star,
    actionLabel: "Browse market",
    actionHref: "/app/market",
  },
};

const statusItems = [
  { label: "Market feed", value: "Waiting", dot: "bg-amber-500" },
  { label: "Token index", value: "Empty", dot: "bg-border" },
  { label: "Watchlist", value: "Ready", dot: "bg-sky-500" },
];

function getActiveTab(tab?: string): MarketTab {
  if (tab === "top-tokens" || tab === "trending" || tab === "watchlist") return tab;
  return "overview";
}

export default async function MarketPage({ searchParams }: MarketPageProps) {
  const params = await searchParams;
  const activeTab = getActiveTab(params.tab);
  const activeEmptyState = emptyStateByTab[activeTab];
  const ActiveIcon = activeEmptyState.icon;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-8 md:px-6 lg:px-8">
      {/* Market header */}
      <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary animate-pulse" />
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Market Intelligence
                </p>
              </div>
              <h1 className="font-display text-3xl font-black tracking-[-0.06em] text-foreground sm:text-4xl">
                Market
              </h1>
              <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                Review token lists, trending movement, and saved market candidates.
              </p>
            </div>

            {/* Tab navigation */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.value === activeTab;
                return (
                  <Link
                    key={tab.value}
                    href={tab.href}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all",
                      isActive
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Status panel */}
          <div className="rounded-xl bg-muted/30 p-5 border border-border/40">
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Feed Status
            </p>
            <div className="flex flex-col gap-3">
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-border/40 bg-card px-4 py-2.5"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm font-black text-foreground">{item.value}</p>
                  </div>
                  <span className={cn("h-2 w-2 rounded-full", item.dot)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        {/* Main content panel */}
        <Card className="min-h-[420px] rounded-2xl border border-border/50 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-black tracking-[-0.03em]">
                  {tabs.find((t) => t.value === activeTab)?.label}
                </CardTitle>
              </div>
              <Badge
                variant="secondary"
                className="bg-primary/10 font-mono text-primary border-none"
              >
                Empty
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <MarketEmptyState
              icon={ActiveIcon}
              title={activeEmptyState.title}
              description={activeEmptyState.description}
              actionLabel={activeEmptyState.actionLabel}
              actionHref={activeEmptyState.actionHref}
            />
          </CardContent>
        </Card>

        <aside className="flex flex-col gap-6">
          <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black tracking-[-0.03em]">Market tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link
                href="/app/analyze"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full justify-between rounded-xl text-sm font-semibold",
                )}
              >
                Analyze token
                <Search className="h-4 w-4" />
              </Link>
              <Link
                href="/app/market?tab=watchlist"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full justify-between rounded-xl bg-background text-sm font-semibold border-border/50",
                )}
              >
                Watchlist
                <Eye className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black tracking-[-0.03em]">Saved filters</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketEmptyState
                className="min-h-[132px] bg-muted/10 border-dashed"
                icon={Search}
                title="No filters saved."
                description="Saved market filters will appear here."
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MarketEmptyState({
  actionHref,
  actionLabel,
  className,
  description,
  icon: Icon,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[332px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/50 px-5 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-base font-bold tracking-[-0.03em] text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-muted-foreground">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-5 rounded-xl border-border bg-card text-sm font-semibold hover:bg-muted",
          )}
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
