"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Heading, Subheading } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden bg-primary py-12 text-center text-primary-foreground sm:py-16 md:py-24">
      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center space-y-5 px-4 sm:space-y-6 sm:px-6">
        <Heading as="h2" size="section" className="max-w-3xl text-center text-primary-foreground">
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span>Build smarter agents with</span>
            <span className="inline-flex h-[1.1em] items-center justify-center rounded-full bg-white/14 px-5 leading-none text-primary-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              onchain intelligence.
            </span>
          </span>
        </Heading>
        <Subheading className="max-w-2xl text-center font-medium text-primary-foreground/88">
          The dashboard access is temporarily paused while we focus on the landing page and product direction.
        </Subheading>

        <div className="flex w-full flex-col gap-2.5 pt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          <span className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-primary-foreground/80 sm:min-w-52 sm:text-sm">
            Dashboard Coming Soon
          </span>
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "min-w-44 border border-white/16 bg-white/10 text-primary-foreground hover:bg-white/16",
            )}
          >
            Explore Docs
          </Link>
          <Link
            href="/roadmap"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "min-w-44 border border-white/16 bg-white/10 text-primary-foreground hover:bg-white/16",
            )}
          >
            Roadmap
          </Link>
        </div>
      </div>
    </section>
  );
}
