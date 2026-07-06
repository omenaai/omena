"use client";

import React from "react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Eyebrow, Heading, Subheading } from "@/components/ui/Typography";
import { Bot, Activity, Shield, Search, Bell, Terminal, ArrowUpRight } from "lucide-react";

const useCasesData = [
  {
    title: "Trading Agents",
    desc: "Algorithmic execution based on sentiment and flow.",
    icon: Bot,
  },
  {
    title: "DeFi Monitoring",
    desc: "Track TVL shifts and yield farming opportunities.",
    icon: Activity,
  },
  {
    title: "Risk Scoring",
    desc: "Real-time wallet and contract trust scores.",
    icon: Shield,
  },
  {
    title: "Onchain Research",
    desc: "Deep dive into historical wallet behaviors.",
    icon: Search,
  },
  {
    title: "Alert Systems",
    desc: "Custom webhooks for specific onchain events.",
    icon: Bell,
  },
  {
    title: "Developer APIs",
    desc: "Integrate intelligence directly into dApps.",
    icon: Terminal,
  },
];

export function UseCases() {
  return (
    <section className="framer-animate mx-auto mt-8 max-w-[1200px] rounded-2xl border border-border bg-muted/40 px-4 py-10 sm:mt-12 sm:rounded-[32px] sm:px-6 sm:py-16">
      <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
        <div className="text-left">
          <Eyebrow>GLOBAL TRANSFERS</Eyebrow>
          <Heading as="h2" size="section" className="font-black text-foreground leading-[1.3] text-balance">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span>Your intelligence layer just got</span>
              <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-5 h-[1.05em] font-black leading-none">
                global
              </span>
            </span>
          </Heading>
          <Subheading className="mt-3 max-w-lg">
            Deep context, real-time threat detection, and modular SDK hooks across multiple chains with clearer paths for both traders and developers.
          </Subheading>

          <div className="mt-8 rounded-[28px] border border-border bg-card p-6 shadow-ambient">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">Why this layout works</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
              The left panel frames the value proposition once, while the right side lets users scan use cases in a dense two-column grid instead of a long single stack.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {useCasesData.map((uc) => {
            const IconComponent = uc.icon;
            return (
              <SpotlightCard
                key={uc.title}
                className="group flex min-h-[220px] cursor-pointer flex-col justify-between bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 md:p-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-2.5 bg-muted/40 rounded-xl text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4.5 h-4.5 text-muted-foreground/85 group-hover:text-primary transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>
                  <h4 className="group-hover:text-primary transition-colors text-base font-black text-foreground">
                    {uc.title}
                  </h4>
                  <p className="text-xs md:text-sm mt-2 leading-relaxed text-muted-foreground/80 font-medium">
                    {uc.desc}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
