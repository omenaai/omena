"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  ShieldCheck,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type AppShellFrameProps = {
  children: ReactNode;
  identity: string;
};

const primaryLinks = [
  { href: "/app", label: "Overview", icon: Home },
  { href: "/app/analyze", label: "Analyzer", icon: LayoutDashboard },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/litepaper", label: "Litepaper", icon: ShieldCheck },
];

const pageMeta = [
  {
    match: (pathname: string) => pathname === "/app",
    title: "Overview",
    description: "Minimal token intelligence workspace with quick access to analysis, modules, and report previews.",
  },
  {
    match: (pathname: string) => pathname === "/app/analyze" || pathname.startsWith("/app/analyze/"),
    title: "Analyzer",
    description: "Review live or fallback token intelligence across risk, behavior, signals, and context.",
  },
];

function getPageMeta(pathname: string) {
  return pageMeta.find((item) => item.match(pathname)) ?? null;
}

export function AppShellFrame({ children, identity }: AppShellFrameProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPage = getPageMeta(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[236px] shrink-0 border-r border-border/60 bg-white/82 p-4 backdrop-blur-xl lg:block">
          <SidebarContent identity={identity} pathname={pathname} onNavigate={() => undefined} />
        </aside>

        <div className="relative flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
            <div className="flex h-15 items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="icon-sm" className="rounded-xl bg-card" onClick={() => setIsMenuOpen(true)} aria-label="Open navigation">
                  <Menu className="h-4 w-4" />
                </Button>
                <Link href="/" className="flex items-center" aria-label="OMENA home">
                  <Image src="/logo.png" alt="OMENA" width={132} height={34} className="h-7 w-auto object-contain" priority />
                </Link>
              </div>
              <div className="max-w-[55vw] truncate rounded-full border border-border/70 bg-card px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                {identity}
              </div>
            </div>
          </header>

          {isMenuOpen ? (
            <div className="fixed inset-0 z-50 bg-foreground/35 lg:hidden" onClick={() => setIsMenuOpen(false)}>
              <div
                className="h-full w-[min(86vw,300px)] border-r border-border/70 bg-sidebar p-4 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <Link href="/" className="flex items-center" aria-label="OMENA home" onClick={() => setIsMenuOpen(false)}>
                    <Image src="/logo.png" alt="OMENA" width={132} height={34} className="h-7 w-auto object-contain" priority />
                  </Link>
                  <Button type="button" variant="outline" size="icon-sm" className="rounded-xl bg-card" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <SidebarContent identity={identity} pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
              </div>
            </div>
          ) : null}

          {currentPage ? (
            <div className="fixed left-0 right-0 top-[60px] z-30 border-b border-border/60 bg-background/92 backdrop-blur-xl lg:left-[236px] lg:top-0">
              <div className="mx-auto flex w-full max-w-[1200px] items-end justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-black tracking-[-0.05em] text-foreground sm:text-3xl">
                    {currentPage.title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
                    {currentPage.description}
                  </p>
                </div>
                <div className="hidden shrink-0 rounded-full border border-border/70 bg-card px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground sm:block">
                  {identity}
                </div>
              </div>
            </div>
          ) : null}

          <main className={cn("relative flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8", currentPage ? "pt-[10.5rem] sm:pt-[11rem] lg:pt-[8.75rem]" : "") }>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  identity,
  pathname,
  onNavigate,
}: {
  identity: string;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="space-y-3">
        <Link href="/" className="flex items-center" aria-label="OMENA home" onClick={onNavigate}>
          <Image src="/logo.png" alt="OMENA" width={132} height={34} className="h-8 w-auto object-contain" priority />
        </Link>

        <div className="rounded-[20px] border border-border/60 bg-card/88 p-4">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-foreground">Workspace</p>
          <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">Minimal token intelligence for fast review.</p>
          <div className="mt-4 truncate rounded-full border border-border/70 bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            {identity}
          </div>
        </div>
      </div>

      <nav className="space-y-1.5" aria-label="App navigation">
        {primaryLinks.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === "/app" ? pathname === "/app" : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-[16px] border px-3.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-border/70 bg-card text-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-border/60 hover:bg-card/72 hover:text-foreground",
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", isActive ? "bg-foreground text-background" : "bg-secondary text-primary")}>
                <Icon className="h-4 w-4" />
              </div>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[20px] border border-border/60 bg-card/88 p-3">
        <div className="flex flex-col gap-2">
          <Link
            href="/docs#api-overview"
            onClick={onNavigate}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "justify-start rounded-[16px] bg-background text-[11px] font-black uppercase tracking-[0.18em]")}
          >
            <FileText className="h-4 w-4" />
            API Flow
          </Link>
          <Link
            href="/"
            onClick={onNavigate}
            className={cn(buttonVariants({ size: "lg" }), "justify-start rounded-[16px] text-[11px] font-black uppercase tracking-[0.18em]")}
          >
            Landing
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <LogoutButton />
        </div>
      </div>


    </div>
  );
}

