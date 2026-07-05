"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function MetricsBar() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-6 framer-animate">
      <Card className="shadow-sm">
        <CardContent className="flex flex-col md:flex-row flex-wrap gap-6 justify-between items-center p-6">
          {/* Metric 1 */}
          <div className="flex flex-col items-center px-6 text-center">
            <span className="font-headline-md text-2xl md:text-3xl text-primary font-bold">50+</span>
            <span className="font-label-xs text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
              Data Sources
            </span>
          </div>

          <div className="hidden md:block w-px h-12 bg-border"></div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center px-6 text-center">
            <span className="font-headline-md text-2xl md:text-3xl text-primary font-bold">24/7</span>
            <span className="font-label-xs text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
              Monitoring
            </span>
          </div>

          <div className="hidden md:block w-px h-12 bg-border"></div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center px-6 text-center">
            <span className="font-headline-md text-2xl md:text-3xl text-primary font-bold">99.9%</span>
            <span className="font-label-xs text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
              Uptime
            </span>
          </div>

          <div className="hidden md:block w-px h-12 bg-border"></div>

          {/* Metric 4 */}
          <div className="flex flex-col items-center px-6 text-center">
            <CheckCircle2 className="text-primary w-8 h-8 mb-1" />
            <span className="font-label-xs text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
              API Agent Ready
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
