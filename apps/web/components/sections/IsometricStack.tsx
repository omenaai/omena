"use client";

import React from "react";
import { Bot, Radio, Database, Link } from "lucide-react";

export function IsometricStack() {
  return (
    <>
      <div className="absolute flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-card shadow-ambient isometric-layer layer-1 group">
        <Bot className="mb-2 h-8 w-8 text-foreground" />
        <h3 className="text-sm font-bold uppercase text-foreground">AGENT LAYER</h3>
        <p className="font-label-xs mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          AI Agents &amp; Applications
        </p>
        <div className="layer-side rounded-b-xl border-none bg-muted" />
        <div className="layer-side-right rounded-r-xl border-none bg-muted/80" />
        <div className="pointer-events-none absolute -top-24 z-50 w-56 rounded-lg border-none bg-popover px-4 py-2.5 text-center text-xs text-popover-foreground opacity-0 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100">
          Autonomous Execution - Powering the next generation of AI agents and applications.
        </div>
      </div>

      <div className="absolute flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-primary shadow-ambient isometric-layer layer-2 group">
        <Radio className="mb-2 h-8 w-8 text-primary-foreground" />
        <h3 className="text-center text-sm font-bold uppercase text-primary-foreground">OMENA INTELLIGENCE LAYER</h3>
        <p className="font-label-xs mt-1 text-[10px] uppercase tracking-widest text-primary-foreground/80">
          Analysis • Signals • Insights
        </p>
        <div className="layer-side rounded-b-xl border-none bg-primary/95" />
        <div className="layer-side-right rounded-r-xl border-none bg-primary/90" />
        <div className="pointer-events-none absolute -top-24 z-50 w-56 rounded-lg border-none bg-popover px-4 py-2.5 text-center text-xs text-popover-foreground opacity-0 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100">
          Signal Extraction - Transforms raw onchain data into risk-aware signals and insights.
        </div>
      </div>

      <div className="absolute flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-card shadow-ambient isometric-layer layer-3 group">
        <Database className="mb-2 h-8 w-8 text-muted-foreground" />
        <h3 className="text-sm font-bold uppercase text-foreground">ONCHAIN DATA LAYER</h3>
        <p className="font-label-xs mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          Wallets • Transactions • Liquidity
        </p>
        <div className="layer-side rounded-b-xl border-none bg-muted" />
        <div className="layer-side-right rounded-r-xl border-none bg-muted/80" />
        <div className="pointer-events-none absolute -top-24 z-50 w-56 rounded-lg border-none bg-popover px-4 py-2.5 text-center text-xs text-popover-foreground opacity-0 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100">
          Data Indexing - Unified access to wallets, transactions, and liquidity across chains.
        </div>
      </div>

      <div className="absolute flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-zinc-950 shadow-ambient isometric-layer layer-4 group">
        <Link className="mb-2 h-8 w-8 text-zinc-400" />
        <h3 className="text-sm font-bold uppercase text-zinc-100">BLOCKCHAIN NETWORKS</h3>
        <p className="font-label-xs mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
          Solana &amp; Multi-Chain
        </p>
        <div className="layer-side rounded-b-xl border-none bg-black" />
        <div className="layer-side-right rounded-r-xl border-none bg-zinc-900" />
        <div className="pointer-events-none absolute -top-24 z-50 w-56 rounded-lg border-none bg-popover px-4 py-2.5 text-center text-xs text-popover-foreground opacity-0 shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100">
          Network Connectivity - Low-latency access to Solana and multi-chain environments.
        </div>
      </div>
    </>
  );
}
