"use client";

import React, { useState } from "react";
import { Activity, ArrowRight, Check, Copy, DatabaseZap, Waves } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const contractAddress = "JB5j3umqLKMfbgPsb7ZyQE6smqJ3v1RhxwdSh2Wppump";

const railItems = [
  {
    href: "/docs#api-overview",
    title: "Token analyzer",
    description: "Paste a Solana token address and generate a structured OMENA report.",
    icon: DatabaseZap,
  },
  {
    href: "/docs",
    title: "Real-time streams",
    description: "Unified access to chain events and wallet activity.",
    icon: Waves,
  },
  {
    href: "/litepaper",
    title: "Intelligence layer",
    description: "Contextual scoring that turns raw activity into decisions.",
    icon: Activity,
  },
];

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyContractAddress = async () => {
    await navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="flex w-full flex-col justify-between bg-grid-pattern lg:min-h-[calc(100vh-104px)]">
      {/* Main hero content */}
      <div className="mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-10 px-4 py-10 text-left sm:px-6 sm:py-16 md:gap-12 md:py-24 lg:grid-cols-12 lg:py-24">
        <div className="min-w-0 space-y-6 sm:space-y-8 lg:col-span-6">
          <div className="space-y-5 sm:space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/45 bg-card px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-primary shadow-[0_0_0_1px_rgba(36,91,255,0.06)] sm:gap-3 sm:px-6 sm:py-2 sm:text-xs">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary/30 sm:h-3 sm:w-3">
                <span className="h-1 w-1 rounded-full bg-primary sm:h-1.5 sm:w-1.5" />
              </span>
              Agent Intelligence Layer
            </div>

            {/* H1 — scales: 260px ZFold → 360px phone → 480px+ → sm → lg */}
            <h1 className="max-w-[760px] font-display font-black leading-[0.9] tracking-[-0.075em] text-[#030303] text-[42px] min-[360px]:text-[54px] min-[480px]:text-[64px] sm:text-[84px] lg:text-[108px]">
              OMENA
            </h1>

            {/* Sub-heading */}
            <div className="max-w-[760px] font-display font-black leading-[1.02] tracking-[-0.055em] text-[#070707] text-[20px] min-[360px]:text-[26px] min-[480px]:text-[34px] sm:text-[44px] lg:text-[58px]">
              Agent Intelligence Layer<span className="text-primary">.</span>
            </div>

            {/* Body */}
            <p className="max-w-xl text-sm font-semibold leading-7 text-[#202532] sm:text-base sm:leading-8 md:text-[18px]">
              The intelligence layer that empowers AI agents with real-time{" "}
              <span className="font-black text-primary">onchain insights</span>, risk analysis, and actionable signals.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:pt-2 sm:gap-3">
            <Link
              href="/app"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-[10px] font-black uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] sm:h-12 sm:px-7 sm:text-xs"
            >
              Open Dashboard
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-10 items-center justify-center rounded-full bg-muted/80 px-5 text-[10px] font-black uppercase tracking-wider text-foreground transition-colors hover:bg-muted active:scale-[0.98] sm:h-12 sm:px-7 sm:text-xs"
            >
              Explore Docs
            </Link>
            <Link
              href="/litepaper"
              className="inline-flex h-10 items-center justify-center rounded-full bg-card px-5 text-[10px] font-black uppercase tracking-wider text-foreground ring-1 ring-border transition-colors hover:bg-muted active:scale-[0.98] sm:h-12 sm:px-7 sm:text-xs"
            >
              Read Litepaper
            </Link>
          </div>

          {/* CA widget — minimalist single-line */}
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-card/60 px-3.5 py-2.5 backdrop-blur-sm sm:rounded-[20px] sm:px-4 sm:py-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-2.5">
              <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.22em] text-primary">CA</span>
              <span className="shrink-0 select-none text-border/80 text-xs">·</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[10px] font-medium text-foreground/70 sm:text-[11px]">
                {contractAddress}
              </span>
            </div>
            <button
              type="button"
              onClick={copyContractAddress}
              aria-label={copied ? "Copied" : "Copy contract address"}
              className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-90"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Right column — hero image */}
        <div className="lg:col-span-6">
          <div className="relative p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="relative mx-auto w-full max-w-[570px] lg:max-w-[630px]">
              <Image
                src="/stack.png"
                alt="Omena stack illustration"
                width={1536}
                height={1024}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rail bar — full-width border-t row, no bleed trick */}
      <div className="w-full border-t border-border bg-surface-container-low shadow-sm">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-center py-5 lg:justify-start">
            <Link
              href="/app"
              className="inline-flex h-10 w-full max-w-[240px] items-center justify-center rounded-full bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98] sm:h-12"
            >
              Open Dashboard
            </Link>
          </div>

          {railItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex items-start gap-3 p-5 text-left transition-colors duration-300 hover:bg-primary/5 sm:gap-3.5 sm:p-6"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary"
                  >
                    {item.title}{" "}
                    <ArrowRight className="h-3 w-3 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                  <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
