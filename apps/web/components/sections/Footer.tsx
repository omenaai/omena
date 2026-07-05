import Link from "next/link";
import Image from "next/image";
import { RiTwitterXFill, RiTelegram2Fill, RiGithubFill } from "react-icons/ri";
import { BookOpen, CircleGauge, FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Litepaper", href: "/litepaper" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Intelligence",
    links: [
      { label: "Architecture", href: "/docs#architecture" },
      { label: "Risk Engine", href: "/docs#risk-intelligence" },
      { label: "API Overview", href: "/docs#api-overview" },
    ],
  },
];

const footerQuickActions = [
  { href: "/docs", label: "Docs", icon: BookOpen, variant: "default" as const },
  { href: "/litepaper", label: "Litepaper", icon: FileText, variant: "outline" as const },
  { href: "/roadmap", label: "Roadmap", icon: CircleGauge, variant: "outline" as const },
];

const socialLinks = [
  { href: siteConfig.social.github, label: "GitHub", icon: RiGithubFill },
  { href: siteConfig.social.x, label: "X", icon: RiTwitterXFill },
  { href: siteConfig.social.telegram, label: "Telegram", icon: RiTelegram2Fill },
];

export function Footer() {
  return (
    <footer className="w-full bg-background">
      <section className="relative overflow-hidden bg-foreground py-5 text-background">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-35 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-background/55">
            Built on trusted infrastructure
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 ring-1 ring-white/12">
              <Image src="/solana.svg" alt="Solana" width={28} height={28} className="h-5 w-5" />
            </div>
            <div className="flex h-9 items-center justify-center rounded-full bg-white px-3.5 ring-1 ring-white/10">
              <Image src="/aws-logo.svg" alt="AWS" width={96} height={96} className="h-4 w-auto" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-10 md:py-12">
        <div className="flex w-full flex-col items-start justify-between gap-5 text-left lg:flex-row lg:items-center">
          <Link className="flex items-center" href="/" aria-label="OMENA home">
            <Image src="/logo.png" alt="OMENA" width={120} height={32} className="h-11 w-auto object-contain" />
          </Link>
          <p className="max-w-xl text-sm font-semibold leading-6 text-muted-foreground">
            The Agent Intelligence Layer for Web3, built for autonomous systems that need trustworthy onchain context.
          </p>
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "bg-background")}
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-y border-border py-6 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr]">
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground">{group.title}</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground">Start</h4>
            <div className="flex flex-wrap items-center gap-2.5">
              {footerQuickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    aria-label={action.label}
                    title={action.label}
                    className={cn(
                      buttonVariants({ variant: action.variant, size: "icon-sm" }),
                      action.variant === "default" ? "shadow-sm" : "bg-background"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 text-[10px] font-semibold text-muted-foreground sm:flex-row">
          <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} Omena. All rights reserved.</p>
          <div className="flex items-center gap-4.5">
            <Link href="/docs" className="transition-colors hover:text-primary">Docs</Link>
            <Link href="/litepaper" className="transition-colors hover:text-primary">Litepaper</Link>
            <Link href="/roadmap" className="transition-colors hover:text-primary">Roadmap</Link>
            <Link href={siteConfig.social.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">GitHub</Link>
            <Link href={siteConfig.social.x} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">X</Link>
            <Link href={siteConfig.social.telegram} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">Telegram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
