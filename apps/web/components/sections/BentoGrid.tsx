"use client";

import React, { useEffect, useState } from "react";
import { BrainCircuit, Database, ShieldAlert, Terminal, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Eyebrow, Heading, Subheading } from "@/components/ui/Typography";
import { Icon } from "@iconify/react";
import Link from "next/link";

type LandingCoin = {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number | null;
  status: "live" | "fallback";
};

const mockTransactions = [
  { name: "Michael Johnson", time: "Received, May 10 4:44 PM", amount: "+$2050.10", type: "up" },
  { name: "Emily Taylor", time: "Sent, May 12 3:21 AM", amount: "-$93.50", type: "down" },
  { name: "Sophia Jackson", time: "Received, May 10 10:10 PM", amount: "+$810.90", type: "up" },
];

const fallbackCoins: LandingCoin[] = [
  { id: "solana", name: "Solana", symbol: "SOL", priceUsd: 142.5, status: "fallback" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", priceUsd: 3450, status: "fallback" },
  { id: "raydium", name: "Raydium", symbol: "RAY", priceUsd: 1.85, status: "fallback" },
  { id: "orca", name: "Orca", symbol: "ORCA", priceUsd: 2.9, status: "fallback" },
];

function formatPrice(priceUsd: number | null) {
  if (priceUsd === null) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: priceUsd >= 100 ? 2 : priceUsd >= 1 ? 2 : 4,
    maximumFractionDigits: priceUsd >= 100 ? 2 : priceUsd >= 1 ? 2 : 4,
  }).format(priceUsd);
}

export function BentoGrid() {
  const [coins, setCoins] = useState<LandingCoin[]>(fallbackCoins);

  useEffect(() => {
    let active = true;

    async function loadPrices() {
      try {
        const response = await fetch("/api/market/landing-prices", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { prices?: LandingCoin[] };

        if (active && Array.isArray(payload.prices) && payload.prices.length > 0) {
          setCoins(payload.prices);
        }
      } catch {
        // Keep fallback prices on failure.
      }
    }

    void loadPrices();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="framer-animate max-w-[1200px] mx-auto px-6 py-12">
      <div className="mb-12 text-left">
        <Eyebrow>EFFORTLESS FINANCE</Eyebrow>
        <Heading as="h2" size="section" className="font-black text-foreground leading-[1.3] text-balance">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>Effortless</span>
            <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-5 h-[1.05em] font-black leading-none">
              global
            </span>
            <span>financial management</span>
          </span>
        </Heading>
        <Subheading className="mt-1 text-muted-foreground/80 font-medium leading-relaxed">
          Designed for high performance agentic workflows.
        </Subheading>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <SpotlightCard className="md:col-span-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between bg-card p-6 md:p-8 lg:p-10 min-h-[360px]">
          <div className="flex justify-between items-center w-full">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <BrainCircuit className="text-primary w-6 h-6" />
            </div>
            <span className="font-body-md text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full uppercase tracking-wider">
              v1.0.0
            </span>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center mt-6 flex-grow">
            <div className="md:col-span-7 flex flex-col justify-center space-y-3">
              <h3 className="text-lg md:text-xl font-black text-foreground tracking-tight">
                Intelligence Engine
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground/85 font-medium">
                Our core proprietary engine that processes raw transaction data through machine learning models to output structured, risk-scored insights specifically formatted for autonomous agent consumption.
              </p>

              <div className="pt-2">
                <Link href="#" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-[#1f4de0] group/link">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 space-y-2 p-4 rounded-2xl bg-muted/30 shadow-inner">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.name}
                  className="flex items-center justify-between gap-3 p-2.5 bg-card rounded-xl text-xs shadow-sm transition-all hover:scale-[1.02] duration-300"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex w-6 h-6 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary font-bold text-[10px]">
                      {tx.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-[10px] truncate">{tx.name}</p>
                      <p className="text-[8px] text-muted-foreground mt-0.5">{tx.time}</p>
                    </div>
                  </div>
                  <span className={`font-bold flex items-center gap-1 text-[10px] shrink-0 ${tx.type === "up" ? "text-primary" : "text-muted-foreground"}`}>
                    {tx.type === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between bg-card p-6 md:p-8 min-h-[360px]">
          <div>
            <div className="bg-primary/10 p-2.5 rounded-xl inline-block w-fit mb-5">
              <Database className="text-primary w-5 h-5" />
            </div>
            <h3 className="text-base md:text-lg font-black text-foreground mb-2">Data Indexer</h3>
            <p className="text-xs md:text-sm leading-relaxed text-muted-foreground/85 font-medium">
              Sub-second latency indexing of multiple chains.
            </p>
          </div>

          <div className="space-y-2 mt-6">
            {coins.map((coin) => (
              <div
                key={coin.id}
                className="flex items-center justify-between text-xs p-2.5 bg-muted/30 rounded-xl transition-colors"
              >
                <span className="flex items-center gap-2 font-bold text-foreground text-[11px]">
                  <span className="flex w-6 h-6 items-center justify-center rounded-lg bg-muted/40 shadow-sm shrink-0 overflow-hidden">
                    <Icon
                      icon={
                        coin.symbol === "SOL" ? "cryptocurrency-color:sol" :
                        coin.symbol === "ETH" ? "cryptocurrency-color:eth" :
                        coin.symbol === "RAY" ? "token-branded:ray" :
                        coin.symbol === "ORCA" ? "token-branded:orca" : "cryptocurrency-color:sol"
                      }
                      className="w-4 h-4"
                    />
                  </span>
                  {coin.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-muted-foreground text-[10px]">{formatPrice(coin.priceUsd)}</span>
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${coin.status === "live" ? "animate-ping bg-emerald-400" : "bg-amber-400"}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${coin.status === "live" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between bg-card p-6 md:p-8 min-h-[360px]">
          <div>
            <div className="bg-primary/10 p-2.5 rounded-xl inline-block w-fit mb-5">
              <ShieldAlert className="text-primary w-5 h-5" />
            </div>
            <h3 className="text-base md:text-lg font-black text-foreground mb-2">Risk Assessment Protocol</h3>
            <p className="text-xs md:text-sm leading-relaxed text-muted-foreground/85 font-medium">
              Continuous evaluation of smart contract vulnerabilities, wallet interaction history, and liquidity pool stability.
            </p>
          </div>

          <div className="mt-6 space-y-2 p-3 rounded-2xl bg-muted/30">
            <div className="flex items-center justify-between text-[10px] p-2 bg-primary/5 rounded-xl transition-all hover:scale-[1.02] duration-300">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Contract Integrity
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">99.8%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] p-2 bg-primary/5 rounded-xl transition-all hover:scale-[1.02] duration-300">
              <span className="font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Liquidity Lockup
              </span>
              <span className="rounded-md bg-primary/12 px-2 py-0.5 font-bold text-primary">100% Locked</span>
            </div>
            <div className="flex items-center justify-between text-[10px] p-2 bg-primary/5 rounded-xl transition-all hover:scale-[1.02] duration-300">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Vulnerability Scan
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">0 Risks Found</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(255,255,255,0.03)"
          className="md:col-span-2 bg-inverse-surface hover:-translate-y-1 transition-all duration-300 text-inverse-on-surface flex flex-col justify-between p-6 md:p-8 lg:p-10 min-h-[360px] relative"
        >
          <div className="flex justify-between items-center w-full">
            <div className="bg-white/5 p-2.5 rounded-xl">
              <Terminal className="text-primary w-5 h-5" />
            </div>
            <span className="font-body-md rounded-full bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/50">
              REST & WS
            </span>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center mt-6 flex-grow">
            <div className="md:col-span-6 flex flex-col justify-center space-y-3">
              <h3 className="text-lg md:text-xl font-black text-inverse-on-surface tracking-tight">
                API First Interface
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-zinc-400 font-medium">
                Sub-second latency indexing of multiple chains. Fully typed REST &amp; WebSocket streams built for autonomous agent consumption.
              </p>

              <div className="pt-2">
                <Link href="#" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-blue-400 transition-colors uppercase tracking-wider group/link">
                  Read API Docs
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 rounded-xl bg-background/10 p-4 font-code-md text-[10px] text-inverse-on-surface/75 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center gap-1.5 mb-3 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <p className="text-zinc-500">
                <span className="text-primary">curl</span> -H <span className="text-inverse-primary">{`"Authorization: Bearer omena_key"`}</span> \
              </p>
              <p className="text-zinc-500">
                &nbsp;&nbsp;https://api.omena.ai/v1/signals
              </p>
              <p className="text-primary mt-2">{"{"}</p>
              <p className="pl-3">
                <span className="text-inverse-primary">{`"status"`}</span>: <span className="text-inverse-primary">{`"success"`}</span>,
              </p>
              <p className="pl-3">
                <span className="text-inverse-primary">{`"riskScore"`}</span>: <span className="text-primary">12</span>,
              </p>
              <p className="pl-3">
                <span className="text-inverse-primary">{`"signals"`}</span>: <span className="text-primary">{"["}</span><span className="text-inverse-primary">{`"liquidity_locked"`}</span><span className="text-primary">{"]"}</span>
              </p>
              <p className="text-primary">{"}"}</p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
