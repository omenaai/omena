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
    <section className="flex w-full flex-col justify-between overflow-hidden bg-grid-pattern lg:min-h-[calc(100vh-104px)]">
      <div className="mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-12 px-6 py-16 text-left md:py-24 lg:grid-cols-12 lg:py-24">
        <div className="space-y-8 lg:col-span-6">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/45 bg-card px-6 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary shadow-[0_0_0_1px_rgba(36,91,255,0.06)]">
              <span className="flex h-3 w-3 items-center justify-center rounded-full border border-primary/30">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Agent Intelligence Layer
            </div>

            <h1 className="max-w-[760px] text-balance font-display text-[60px] font-black leading-[0.9] tracking-[-0.075em] text-[#030303] sm:text-[84px] lg:text-[108px]">
              OMENA
            </h1>

            <div className="max-w-[760px] font-display text-[30px] font-black leading-[1.02] tracking-[-0.055em] text-[#070707] sm:text-[44px] lg:text-[58px]">
              Agent Intelligence Layer<span className="text-primary">.</span>
            </div>

            <p className="max-w-xl text-base font-semibold leading-8 text-[#202532] sm:text-[20px]">
              The intelligence layer that empowers AI agents with real-time{" "}
              <span className="font-black text-primary">onchain insights</span>, risk analysis, and actionable signals.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:pt-2">
            <span className="inline-flex h-12 items-center justify-center rounded-full bg-muted px-7 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Dashboard Coming Soon
            </span>
            <Link
              href="/docs"
              className="inline-flex h-12 items-center justify-center rounded-full bg-muted/80 px-7 text-xs font-black uppercase tracking-wider text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
            >
              Explore Docs
            </Link>
            <Link
              href="/litepaper"
              className="inline-flex h-12 items-center justify-center rounded-full bg-card px-7 text-xs font-black uppercase tracking-wider text-foreground ring-1 ring-border transition-colors hover:bg-muted active:scale-[0.98]"
            >
              Read Litepaper
            </Link>
          </div>

          <div className="flex flex-col gap-2 rounded-[28px] border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">CA</p>
              <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs font-semibold text-foreground sm:text-sm">
                {contractAddress}
              </p>
            </div>
            <button
              type="button"
              onClick={copyContractAddress}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[11px] font-black uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:scale-[0.99] active:scale-[0.97]"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy CA"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative p-4 md:p-6 lg:p-8">
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

      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-surface-container-low shadow-sm">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-center p-6 lg:justify-start">
            <span className="inline-flex h-12 w-full items-center justify-center rounded-full bg-muted text-xs font-black uppercase tracking-widest text-muted-foreground shadow-sm">
              Dashboard Coming Soon
            </span>
          </div>

          {railItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="group flex items-start gap-3.5 p-6 text-left transition-colors duration-300 hover:bg-primary/5">
                <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <Link href={item.href} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
                    {item.title} <ArrowRight className="h-3 w-3 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
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
