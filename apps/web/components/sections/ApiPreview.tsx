"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Heading, Subheading } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

export function ApiPreview() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeText = `import { OmenaClient } from '@omena/sdk';

const client = new OmenaClient({
  apiKey: process.env.OMENA_KEY
});

async function analyzeTarget(address: string) {
  const analysis = await client.signals.analyze({
    target: address,
    depth: 'comprehensive',
    includeRiskScore: true
  });

  if (analysis.riskScore > 80) {
    console.log('High risk detected', analysis.flags);
  } else {
    await executeTrade(address);
  }
}`;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="framer-animate max-w-[1200px] mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Code Block */}
        <SpotlightCard 
          spotlightColor="rgba(255, 255, 255, 0.02)" 
          className="bg-inverse-surface p-5 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all relative"
        >
          <div className="p-0 relative z-10">
            <div className="flex items-center justify-between pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 font-code-md text-[10px] text-white/35">agent.ts</span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleCopy}
                className="rounded-full bg-background/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-inverse-on-surface/55 hover:text-inverse-on-surface cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <pre className="font-code-md text-xs text-zinc-300 overflow-x-auto leading-6 p-1">
              <code>
                <span className="token keyword">import</span> {"{ OmenaClient }"} <span className="token keyword">from</span> <span className="token string">&apos;@omena/sdk&apos;</span>;{"\n\n"}
                <span className="token keyword">const</span> client = <span className="token keyword">new</span> OmenaClient({"{"}{"\n"}
                {"  "}<span className="token property">apiKey</span>: process.env.OMENA_KEY{"\n"}
                {"}"});{"\n\n"}
                <span className="token keyword">async function</span> <span className="token function">analyzeTarget</span>(address: string) {"{"}{"\n"}
                {"  "}<span className="token keyword">const</span> analysis = <span className="token keyword">await</span> client.signals.<span className="token function">analyze</span>({"{"}{"\n"}
                {"    "}<span className="token property">target</span>: address,{"\n"}
                {"    "}<span className="token property">depth</span>: <span className="token string">&apos;comprehensive&apos;</span>,{"\n"}
                {"    "}<span className="token property">includeRiskScore</span>: <span className="token keyword">true</span>{"\n"}
                {"  "}{"}"});{"\n\n"}
                {"  "}<span className="token keyword">if</span> (analysis.riskScore &gt; <span className="token number">80</span>) {"{"}{"\n"}
                {"    "}console.<span className="token function">log</span>(<span className="token string">&apos;High risk detected&apos;</span>, analysis.flags);{"\n"}
                {"  "}{"}"} <span className="token keyword">else</span> {"{"}{"\n"}
                {"    "}<span className="token keyword">await</span> <span className="token function">executeTrade</span>(address);{"\n"}
                {"  "}{"}"}{"\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </SpotlightCard>

        {/* Right Column: Benefits List */}
        <div className="space-y-6">
          <Heading as="h2" size="section" className="font-black text-foreground leading-[1.3] text-balance">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span>Developer-first</span>
              <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-5 h-[1.05em] font-black leading-none">
                integration.
              </span>
            </span>
          </Heading>
          <Subheading className="text-muted-foreground/80 leading-relaxed">
            Build robust agents with a few lines of code. Our SDK handles the complexity of cross-chain data normalization and risk modeling.
          </Subheading>

          <ul className="space-y-3.5">
            {[
              "Typed SDKs for TypeScript and Python",
              "Comprehensive risk scoring models",
              "WebSocket support for live streaming",
              "Detailed endpoint documentation",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <Check className="text-primary w-3.5 h-3.5" />
                </div>
                <span className="font-body-md text-sm text-foreground font-bold">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
