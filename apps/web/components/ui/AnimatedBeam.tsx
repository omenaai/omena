"use client";

import React, { useRef } from "react";
import { Database, ShieldAlert, Terminal, Bot, Wallet, Layers } from "lucide-react";
import { AnimatedBeam as MagicBeam } from "./animated-beam";

export function AnimatedBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ledgerRef = useRef<HTMLDivElement>(null);
  const poolsRef = useRef<HTMLDivElement>(null);
  const walletsRef = useRef<HTMLDivElement>(null);
  
  const centerRef = useRef<HTMLDivElement>(null);
  
  const tradingRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative isolate flex w-full max-w-none mx-auto aspect-[4/3] bg-transparent p-0 overflow-hidden items-center justify-between pt-4 md:max-w-[600px] md:aspect-[16/11] md:rounded-3xl md:bg-card md:p-8 md:shadow-sm"
    >
      {/* Left Column (Inputs) */}
      <div className="relative z-10 flex flex-col justify-between h-full w-[38%] py-2 md:w-[35%] md:py-4">
        {/* Ledger Node */}
        <div 
          ref={ledgerRef}
          className="flex items-center gap-2 bg-card shadow-sm p-2 rounded-xl w-full group transition-colors md:gap-3 md:p-2.5 md:rounded-2xl"
        >
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center w-7 h-7 shrink-0 md:w-8 md:h-8 md:rounded-xl">
            <Database className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[9px] font-black uppercase text-foreground leading-none tracking-wide md:text-[10px]">Ledger</p>
            <p className="text-[8px] text-zinc-400 mt-1 leading-none font-medium truncate">Transactions</p>
          </div>
        </div>

        {/* DEX Pools Node */}
        <div 
          ref={poolsRef}
          className="flex items-center gap-2 bg-card shadow-sm p-2 rounded-xl w-full group transition-colors md:gap-3 md:p-2.5 md:rounded-2xl"
        >
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center w-7 h-7 shrink-0 md:w-8 md:h-8 md:rounded-xl">
            <Layers className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[9px] font-black uppercase text-foreground leading-none tracking-wide md:text-[10px]">DEX Pools</p>
            <p className="text-[8px] text-zinc-400 mt-1 leading-none font-medium truncate">Liquidity</p>
          </div>
        </div>

        {/* Wallets Node */}
        <div 
          ref={walletsRef}
          className="flex items-center gap-2 bg-card shadow-sm p-2 rounded-xl w-full group transition-colors md:gap-3 md:p-2.5 md:rounded-2xl"
        >
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center w-7 h-7 shrink-0 md:w-8 md:h-8 md:rounded-xl">
            <Wallet className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[9px] font-black uppercase text-foreground leading-none tracking-wide md:text-[10px]">Wallets</p>
            <p className="text-[8px] text-zinc-400 mt-1 leading-none font-medium truncate">Profiles</p>
          </div>
        </div>
      </div>

      {/* Center Column (Omena Core) */}
      <div className="relative z-10 flex items-center justify-center w-[18%] md:w-[20%]">
        <div ref={centerRef} className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-primary/15 rounded-full blur-xl animate-pulse group-hover:bg-primary/25" />
          <div className="relative flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-2xl shadow-glow transform transition-transform group-hover:scale-105 duration-300 md:w-14 md:h-14">
            <img 
              src="/logo.png" 
              alt="Omena Logo" 
              className="w-8 h-8 object-contain brightness-0 invert" 
            />
          </div>
        </div>
      </div>

      {/* Right Column (Outputs) */}
      <div className="relative z-10 flex flex-col justify-between h-full w-[38%] py-2 md:w-[35%] md:py-4">
        {/* Trading Node */}
        <div 
          ref={tradingRef}
          className="flex items-center justify-between gap-2 bg-card shadow-sm p-2 rounded-xl w-full group transition-colors md:gap-3 md:p-2.5 md:rounded-2xl"
        >
          <div className="text-left min-w-0 pl-1">
            <p className="text-[9px] font-black uppercase text-foreground leading-none tracking-wide md:text-[10px]">Trading</p>
            <p className="text-[8px] text-zinc-400 mt-1 leading-none font-medium truncate">Automated Bots</p>
          </div>
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center w-7 h-7 shrink-0 md:w-8 md:h-8 md:rounded-xl">
            <Bot className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
        </div>

        {/* Risk Alerts Node */}
        <div 
          ref={alertsRef}
          className="flex items-center justify-between gap-2 bg-card shadow-sm p-2 rounded-xl w-full group transition-colors md:gap-3 md:p-2.5 md:rounded-2xl"
        >
          <div className="text-left min-w-0 pl-1">
            <p className="text-[9px] font-black uppercase text-foreground leading-none tracking-wide md:text-[10px]">Risk Alerts</p>
            <p className="text-[8px] text-zinc-400 mt-1 leading-none font-medium truncate">Webhooks</p>
          </div>
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center w-7 h-7 shrink-0 md:w-8 md:h-8 md:rounded-xl">
            <ShieldAlert className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
        </div>

        {/* Dev API Node */}
        <div 
          ref={apiRef}
          className="flex items-center justify-between gap-2 bg-card shadow-sm p-2 rounded-xl w-full group transition-colors md:gap-3 md:p-2.5 md:rounded-2xl"
        >
          <div className="text-left min-w-0 pl-1">
            <p className="text-[9px] font-black uppercase text-foreground leading-none tracking-wide md:text-[10px]">Dev API</p>
            <p className="text-[8px] text-zinc-400 mt-1 leading-none font-medium truncate">REST &amp; WS</p>
          </div>
          <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center w-7 h-7 shrink-0 md:w-8 md:h-8 md:rounded-xl">
            <Terminal className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
        </div>
      </div>

      {/* Animated Beams connecting nodes */}
      <MagicBeam
        containerRef={containerRef}
        fromRef={ledgerRef}
        toRef={centerRef}
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--inverse-primary)"
        pathColor="rgba(37, 99, 235, 0.08)"
        pathWidth={1.5}
        endpointInset={42}
        duration={4}
      />
      <MagicBeam
        containerRef={containerRef}
        fromRef={poolsRef}
        toRef={centerRef}
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--inverse-primary)"
        pathColor="rgba(37, 99, 235, 0.08)"
        pathWidth={1.5}
        endpointInset={42}
        duration={4}
        delay={1.2}
      />
      <MagicBeam
        containerRef={containerRef}
        fromRef={walletsRef}
        toRef={centerRef}
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--inverse-primary)"
        pathColor="rgba(37, 99, 235, 0.08)"
        pathWidth={1.5}
        endpointInset={42}
        duration={4}
        delay={2.4}
      />
      <MagicBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={tradingRef}
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--inverse-primary)"
        pathColor="rgba(37, 99, 235, 0.08)"
        pathWidth={1.5}
        endpointInset={42}
        duration={4}
        delay={0.6}
      />
      <MagicBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={alertsRef}
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--inverse-primary)"
        pathColor="rgba(37, 99, 235, 0.08)"
        pathWidth={1.5}
        endpointInset={42}
        duration={4}
        delay={1.8}
      />
      <MagicBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={apiRef}
        gradientStartColor="var(--primary)"
        gradientStopColor="var(--inverse-primary)"
        pathColor="rgba(37, 99, 235, 0.08)"
        pathWidth={1.5}
        endpointInset={42}
        duration={4}
        delay={3}
      />
    </div>
  );
}
