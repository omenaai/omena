"use client";

import React, { useState } from "react";
import { Terminal, Layout, MessageSquare, CheckCircle2, Database, Sparkles, Send, Copy, Check } from "lucide-react";
import { Icon } from "@iconify/react";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Heading, Subheading } from "@/components/ui/Typography";
import { RiskScoreChart } from "@/components/ui/RiskScoreChart";
import Link from "next/link";

const auditRows = [
  { label: "Liquidity Lock (365d)", value: "Low Risk" },
  { label: "Owner Privileges (Multisig)", value: "Low Risk" },
  { label: "Flashloan Security", value: "Safe" },
  { label: "Trust Score", value: "98/100" },
];

const tabs = [
  { id: "chat", label: "Conversational", icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: "notebook", label: "SQL Notebook", icon: <Terminal className="w-3.5 h-3.5" /> },
  { id: "cockpit", label: "Security Cockpit", icon: <Layout className="w-3.5 h-3.5" /> },
] as const;

export function InteractiveSandbox() {
  const [activeTab, setActiveTab] = useState<"notebook" | "cockpit" | "chat">("chat");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    const code = `import { OmenaClient } from '@omena/sdk';
const client = new OmenaClient({ apiKey: process.env.OMENA_KEY });
const analysis = await client.signals.analyze({ target: address, depth: 'comprehensive' });`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="framer-animate mx-auto max-w-[1200px] px-6 py-12">
      {/* Heading Section */}
      <div className="mb-10 max-w-2xl text-left">
        <Eyebrow>INTERACTIVE</Eyebrow>
        <Heading as="h2" size="section" className="font-black text-foreground leading-[1.3] text-balance">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>Experience the</span>
            <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-5 h-[1.05em] font-black leading-none">
              intelligence layer.
            </span>
          </span>
        </Heading>
        <Subheading className="mt-2">
          Toggle between our core agent utilities to see how Omena processes onchain data in real time.
        </Subheading>
      </div>

      {/* Unified Minimalist Light Console Box */}
      <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-[32px] border border-border bg-card/80 p-5 shadow-ambient backdrop-blur-sm md:p-8">
        {/* Console Header Bar */}
        <div className="flex w-full items-center justify-center pb-6 relative z-10">
          {/* Segmented Control Tabs */}
          <div className="flex bg-muted p-1 rounded-full w-full sm:w-auto overflow-x-auto gap-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <Button
                  variant="ghost"
                  size="sm"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-5 py-2 text-[10px] font-black uppercase tracking-wider rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 grid items-stretch gap-8 lg:grid-cols-12">
          {/* Left Side: Explanations (4 cols) */}
          <div className="flex flex-col justify-between space-y-6 text-left lg:col-span-5">
            <div className="space-y-4">
              {activeTab === "chat" && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
                    <Sparkles className="text-primary w-3 h-3" />
                    <span className="font-body-md text-[8px] font-black text-primary uppercase tracking-widest">NLP Query Engine</span>
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">Conversational Audits</h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    Autonomous agents and developers can query Omena in natural language to perform instant smart contract audits, security evaluations, and risk summaries.
                  </p>
                </div>
              )}

              {activeTab === "notebook" && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
                    <Database className="text-primary w-3 h-3" />
                    <span className="font-body-md text-[8px] font-black text-primary uppercase tracking-widest">Structured SDK</span>
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">SQL Data Notebook</h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    A programmatically queryable SQL sandbox allowing agents to extract, filter, and normalize multi-chain wallet data and router paths with sub-second latency.
                  </p>
                </div>
              )}

              {activeTab === "cockpit" && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full">
                    <Layout className="text-primary w-3 h-3" />
                    <span className="font-body-md text-[8px] font-black text-primary uppercase tracking-widest">Visual Cockpit</span>
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">Visual Security Hub</h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    A unified monitoring hub designed for developers to keep track of threat intelligence signals, consensus network uptimes, and real-time smart contract alerts.
                  </p>
                </div>
              )}

              {/* Console Spec List */}
              <div className="space-y-3 border-t border-border pt-5">
                <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-wider block">Key Capabilities</span>
                <ul className="text-xs space-y-2.5 text-muted-foreground/85">
                  {activeTab === "chat" && (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Natural language smart contract checks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Visible multi-step thinking process</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Continuous background updates</span>
                      </li>
                    </>
                  )}
                  {activeTab === "notebook" && (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Raw ledger SQL explorer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Sub-second wallet risk lookups</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Auto-formatted JSON API outputs</span>
                      </li>
                    </>
                  )}
                  {activeTab === "cockpit" && (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Live network transaction tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Interactive node connectivity maps</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>High-frequency websocket triggers</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Quick action button */}
            <div className="pt-2">
              <Link
                href="#"
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/85 text-primary-foreground font-black text-[10px] h-9 px-5 rounded-full transition-transform active:scale-95 shadow-sm uppercase tracking-wider"
              >
                Open Documentation
              </Link>
            </div>
          </div>

          {/* Right Side: Tab Previews inside a gorgeous minimalist frame (8 cols) */}
          <div className="relative flex min-h-0 flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-muted/50 p-4 md:min-h-[440px] md:p-6 lg:col-span-7">
            {activeTab === "chat" && (
              <div className="space-y-4 text-left animate-in fade-in duration-300 flex-grow flex flex-col justify-between">
                <div className="flex items-center gap-2 pb-3 mb-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  Conversational Sandbox
                </div>

                <div className="flex-grow flex flex-col justify-end space-y-4">
                  {/* User Bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-muted px-4 py-2.5 rounded-2xl rounded-tr-none text-xs font-semibold text-muted-foreground shadow-sm">
                      Can you analyze the risk score of the new Raydium liquidity contract?
                    </div>
                  </div>

                  {/* Agent Bubble */}
                  <div className="space-y-3 bg-card p-4.5 rounded-2xl shadow-sm">
                    <div className="text-xs leading-relaxed text-muted-foreground/90 space-y-2">
                      <p>I&apos;ll run a comprehensive audit on the Raydium pool contract. Checking transaction logs, liquidity locks, and compiler warnings.</p>
                      <p className="pl-3 font-code-md text-[10px] text-primary font-bold">
                        Thought for 12 seconds
                      </p>
                    </div>

                    <div className="pt-2.5">
                      <p className="font-bold text-xs text-foreground mb-2">Raydium contract risk report:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        {auditRows.map((row) => (
                          <div key={row.label} className="flex items-center justify-between text-xs text-muted-foreground py-1">
                            <span className="font-medium text-muted-foreground/80">{row.label}</span>
                            <span className="flex items-center gap-1 font-bold text-primary text-[10px]">
                              <CheckCircle2 className="w-3.5 h-3.5 fill-primary text-primary-foreground" />
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 w-full border-t border-border pt-3.5">
                      <RiskScoreChart bare />
                    </div>
                  </div>
                </div>

                {/* Input Mock */}
                <div className="flex items-center justify-between px-4 py-3 rounded-full text-xs text-muted-foreground/60 bg-card mt-4.5">
                  <span className="text-[11px] font-semibold text-muted-foreground/50 select-none">Ask Omena agent another question...</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      Mainnet RPC
                    </span>
                    <Send className="w-3.5 h-3.5 hover:text-primary cursor-pointer text-muted-foreground/75 transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notebook" && (
              <div className="space-y-4 text-left animate-in fade-in duration-300 flex-grow flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                    <Terminal className="w-3.5 h-3.5 text-primary" />
                    OMENA SQL Workspace
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={copyCode}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 bg-card cursor-pointer transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 animate-in fade-in" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="font-body-md text-xs text-muted-foreground/90 flex-grow space-y-4 flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-2 select-none">Querying Solana Transaction Ledger</p>
                    <div className="font-code-md rounded-2xl bg-inverse-surface text-inverse-on-surface/75 p-4 leading-6 shadow-inner relative">
                      <p className="select-none text-white/35">{"// Extract transaction logs for scoring"}</p>
                      <p>
                        <span className="text-inverse-primary font-bold">SELECT</span> block_time, value_usd, target_protocol
                      </p>
                      <p>
                        <span className="text-inverse-primary font-bold">FROM</span> solana.transactions
                      </p>
                      <p>
                        <span className="text-inverse-primary font-bold">WHERE</span> sender ={" "}
                        <span className="text-primary">&apos;0x71a9...f4b&apos;</span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden bg-card p-2 space-y-1.5 animate-in fade-in duration-300">
                    <div className="bg-transparent px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 select-none">
                      Console Results
                    </div>
                    {[
                      { time: "12:04:15", amount: "$42,300.00", protocol: "Raydium Pool", status: "Low Risk" },
                      { time: "12:01:30", amount: "$38,700.00", protocol: "Orca Router", status: "Safe" },
                      { time: "11:58:04", amount: "$33,100.00", protocol: "Jupiter Agg.", status: "Safe" }
                    ].map((row, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2.5 text-[11px] bg-muted/10 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground/40 font-code-md text-[10px]">{row.time}</span>
                          <span className="flex w-5 h-5 items-center justify-center rounded-lg bg-card shadow-sm shrink-0 overflow-hidden">
                            <Icon 
                              icon={
                                row.protocol.includes("Raydium") ? "token-branded:ray" :
                                row.protocol.includes("Orca") ? "token-branded:orca" : "token-branded:jup"
                              } 
                              className="w-3.5 h-3.5" 
                            />
                          </span>
                          <span className="font-bold text-foreground/80">{row.amount} &middot; {row.protocol}</span>
                        </div>
                        <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{row.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cockpit" && (
              <div className="space-y-4 text-left animate-in fade-in duration-300 flex-grow flex flex-col justify-between h-full">
                <div className="flex items-center justify-between pb-3 mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                    <Layout className="w-3.5 h-3.5 text-primary" />
                    Data Flow Graph
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    Real-Time
                  </span>
                </div>

                <div className="mb-2">
                  <h3 className="font-black text-sm text-foreground">Security Cockpit</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Live visualization of threat intelligence pipelines streaming to agents.</p>
                </div>

                {/* Animated Beam network visual */}
                <div className="overflow-hidden p-0 pt-8 flex-grow flex items-center justify-center md:rounded-2xl md:bg-muted/10 md:p-4">
                  <AnimatedBeam />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
