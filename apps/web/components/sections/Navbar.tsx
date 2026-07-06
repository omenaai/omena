"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { RiTwitterXFill, RiTelegram2Fill, RiGithubFill } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { Marquee } from "@/components/ui/Marquee";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Docs", href: "/docs" },
  { name: "Litepaper", href: "/litepaper" },
  { name: "Roadmap", href: "/roadmap" },
];

const announcements = [
  "UNLOCKED 50+ REAL-TIME WEB3 DATA STREAMS | OMENA RESEARCH LITERATION V1.0 IS NOW LIVE | TRANSFORMING ONCHAIN DATA INTO INTELLIGENCE",
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b border-border bg-background">
      <div className="mx-auto grid h-14 w-full max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:h-16 sm:gap-6 sm:px-6 lg:grid-cols-3">
        <div className="flex items-center lg:justify-self-start">
          <Link className="flex shrink-0 items-center" href="/" aria-label="OMENA home">
            <Image
              src="/logo.png"
              alt="OMENA"
              width={132}
              height={34}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-7 lg:flex lg:justify-self-center" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              className="font-body-md relative text-[10px] font-bold uppercase tracking-wider text-foreground/80 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary after:transition-all hover:text-foreground hover:after:w-full"
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 lg:flex lg:justify-self-end">
          <Link
            href={siteConfig.social.telegram}
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            title="Telegram"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/20 hover:bg-muted"
          >
            <RiTelegram2Fill className="h-4 w-4" />
          </Link>

          <Link
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/20 hover:bg-muted"
          >
            <RiGithubFill className="h-4 w-4" />
          </Link>

          <Link
            href={siteConfig.social.x}
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            title="X"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/20 hover:bg-muted"
          >
            <RiTwitterXFill className="h-4 w-4" />
          </Link>

          <Link
            href="/auth"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            Sign In
          </Link>
        </div>

        <div className="flex items-center justify-end lg:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer text-muted-foreground hover:text-primary"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="w-full overflow-hidden bg-background">
        <Marquee className="mx-auto max-w-[1200px] px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-foreground/75 [--duration:42s] sm:px-6 sm:py-2.5 sm:text-[10px]" repeat={4}>
          {announcements.map((item) => (
            <div key={item} className="flex items-center gap-4 whitespace-nowrap">
              <span>{item}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {isOpen && (
        <div className="absolute left-4 right-4 top-14 z-50 space-y-4 rounded-3xl border border-border bg-card p-4 shadow-ambient animate-in fade-in slide-in-from-top-2 duration-200 sm:left-6 sm:right-6 sm:top-16 sm:p-5">
          <div className="flex flex-col gap-3 pl-2 text-left">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                href={link.href}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link
            href="/auth"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-full items-center justify-center rounded-full bg-primary text-xs font-black uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              aria-label="GitHub"
              title="GitHub"
              className="flex h-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted/60"
            >
              <RiGithubFill className="h-4 w-4" />
            </Link>
            <Link
              href={siteConfig.social.x}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              aria-label="X"
              title="X"
              className="flex h-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted/60"
            >
              <RiTwitterXFill className="h-4 w-4" />
            </Link>
            <Link
              href={siteConfig.social.telegram}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              aria-label="Telegram"
              title="Telegram"
              className="flex h-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted/60"
            >
              <RiTelegram2Fill className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
