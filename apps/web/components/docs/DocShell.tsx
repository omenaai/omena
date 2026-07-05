"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Box,
  Braces,
  ChevronRight,
  CircleGauge,
  Code2,
  Database,
  FileText,
  Fingerprint,
  Home,
  Network,
  Search,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

type DocLink = {
  href: string;
  label: string;
};

type DocShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  links?: DocLink[];
  sections?: DocLink[];
};

const sectionIcons = [Network, Shield, Fingerprint, Zap, Sparkles, Braces, BookOpen, Database, Code2, Box];
const primaryItems = [
  { href: "/docs", label: "Docs", icon: Home },
  { href: "/litepaper", label: "Litepaper", icon: FileText },
  { href: "/roadmap", label: "Roadmap", icon: CircleGauge },
];

export function DocShell({ children, title, description, links = [], sections = [] }: DocShellProps) {
  const [activeHash, setActiveHash] = useState("");
  const [pathname, setPathname] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const currentSectionItems = sections.map((section, index) => ({
    ...section,
    icon: sectionIcons[index] ?? FileText,
  }));

  const searchIndex = [
    ...primaryItems.map((item) => ({
      href: item.href,
      label: item.label,
      type: "Page",
    })),
    ...sections.map((section) => ({
      href: section.href,
      label: section.label,
      type: "Section",
    })),
  ];

  const searchQuery = debouncedSearch.trim().toLowerCase();
  const searchResults = searchQuery
    ? searchIndex.filter((item) => `${item.label} ${item.href} ${item.type}`.toLowerCase().includes(searchQuery))
    : [];

  const isSearchActive = debouncedSearch.trim().length > 0;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    const updatePath = () => {
      setPathname(window.location.pathname);
      setActiveHash(window.location.hash || sections[0]?.href || "");
    };

    updatePath();
    window.addEventListener("hashchange", updatePath);

    return () => window.removeEventListener("hashchange", updatePath);
  }, [sections]);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      let current = sections[0]?.href || "";

      for (const section of sections) {
        const id = section.href.replace("#", "");
        const element = document.getElementById(id);

        if (element && element.getBoundingClientRect().top <= 140) {
          current = section.href;
        }
      }

      setActiveHash(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  const resolveHref = (href: string) => {
    return href.startsWith("#") ? `${pathname || "/docs"}${href}` : href;
  };

  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return activeHash === href;
    }

    return pathname === href;
  };

  const renderNavItem = (
    item: DocLink & { icon: React.ComponentType<{ className?: string }> },
    options?: { compact?: boolean },
  ) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={resolveHref(item.href)}
        className={[
          "flex min-h-9 items-center gap-3 rounded-2xl px-3 text-xs font-semibold transition-colors",
          "min-h-9",
          active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ].join(" ")}
      >
        <Icon className={["h-4 w-4", active ? "text-primary" : "text-muted-foreground"].join(" ")} />
        <span className="leading-tight">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed left-0 right-0 top-0 z-40 grid h-14 grid-cols-[104px_1fr] border-b border-border/80 bg-background/90 backdrop-blur-xl sm:grid-cols-[196px_1fr_auto]">
        <div className="flex items-center gap-2 border-r border-border/80 px-3 sm:px-5">
          <Link href="/" className="flex items-center gap-2" aria-label="OMENA home">
            <Image src="/logo.png" alt="OMENA" width={40} height={40} className="h-10 w-10 object-contain" priority />
            <Badge variant="secondary" className="max-[420px]:hidden">Docs</Badge>
          </Link>
        </div>

        <div className="relative flex min-w-0 items-center px-3 sm:px-5">
          <label className="flex h-10 w-full max-w-[420px] items-center gap-2 rounded-full border border-border bg-card px-4 text-muted-foreground shadow-sm">
            <Search className="h-4 w-4" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 150)}
              className="min-w-0 flex-1 bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Search documentation"
              type="search"
            />
            <span className="ml-auto hidden text-[10px] font-semibold text-muted-foreground sm:inline">500ms</span>
          </label>

          {searchFocused && isSearchActive && (
            <Card className="absolute left-5 top-12 z-50 w-[min(420px,calc(100vw-40px))] rounded-[28px] p-2 shadow-[0_16px_40px_rgba(9,17,31,0.1)]">
              <CardContent className="px-0">
              {searchResults.length > 0 ? (
                searchResults.slice(0, 8).map((result) => (
                  <Link
                    key={`${result.href}-${result.type}`}
                    href={resolveHref(result.href)}
                    className="flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <span>{result.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{result.type}</span>
                  </Link>
                ))
              ) : (
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">No documentation results.</div>
              )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="hidden items-center gap-5 px-5 sm:flex">
          <Link href="/docs" className="hidden items-center gap-1 text-xs font-bold text-foreground sm:flex">
            Docs
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-14 z-30 hidden w-[196px] overflow-y-auto border-r border-sidebar-border bg-sidebar/90 px-2 py-4 backdrop-blur lg:block">
        <nav className="space-y-5">
          <div className="space-y-1">
            {primaryItems.map((item) => renderNavItem(item, { compact: true }))}
          </div>

          {currentSectionItems.length > 0 && (
            <div>
              <p className="mb-2 px-3 text-[11px] font-medium text-muted-foreground">On this page</p>
              <div className="space-y-1">
                {(isSearchActive ? currentSectionItems.filter((item) => item.label.toLowerCase().includes(debouncedSearch.toLowerCase())) : currentSectionItems).map((item) =>
                  renderNavItem(item),
                )}
              </div>
            </div>
          )}

          <div>
            <Link
              href="/docs#api-overview"
              className="flex min-h-10 items-center justify-between rounded-2xl px-3 text-xs font-bold text-foreground transition-colors hover:bg-muted"
            >
              See all references
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </aside>

      <main className="docs-grid min-h-screen pt-14 lg:pl-[196px]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-7 md:px-10 md:py-8">
          <nav className="mb-6 flex gap-2 overflow-x-auto border-b border-border/80 pb-4 lg:hidden">
            {links.length > 0 ? links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-full bg-muted px-4 py-2 text-xs font-bold text-muted-foreground"
              >
                {link.label}
              </Link>
            )) : null}
          </nav>

          <article className="min-w-0">
            <header className="mb-6">
              <Badge variant="secondary" className="mb-3">Get setup</Badge>
              <h1 className="max-w-4xl font-display text-[30px] font-black leading-[1.05] tracking-[-0.045em] text-foreground md:text-[34px]">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-muted-foreground">
                {description}
              </p>
            </header>

            {sections.length > 0 && (
              <nav className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(isSearchActive ? sections.filter((section) => section.label.toLowerCase().includes(debouncedSearch.toLowerCase())) : sections.slice(0, 4)).map((section, index) => {
                  const Icon = sectionIcons[index] ?? FileText;

                  return (
                    <Link
                      key={section.href}
                      href={resolveHref(section.href)}
                      className={[
                        "min-h-[142px] rounded-[28px] border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/25 hover:bg-accent/40",
                        activeHash === section.href ? "border-primary/45 ring-2 ring-primary/10" : "",
                      ].join(" ")}
                    >
                      <Icon className={["mb-5 h-6 w-6", activeHash === section.href ? "text-primary" : "text-muted-foreground"].join(" ")} />
                      <h2 className="mb-2 text-sm font-bold text-foreground">{section.label}</h2>
                      <p className="text-xs font-medium leading-5 text-muted-foreground">
                        Explore OMENA guidance and resources for this technical area.
                      </p>
                    </Link>
                  );
                })}
              </nav>
            )}

            <div className="omena-mdx">{children}</div>
          </article>
        </div>
      </main>
    </div>
  );
}
