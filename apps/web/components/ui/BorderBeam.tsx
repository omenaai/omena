"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export function BorderBeam({
  className,
  size = 140,
  duration = 6,
  colorFrom = "#2563eb",
  colorTo = "#818cf8",
  borderWidth = 1.5,
  borderRadius = 16,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent z-20",
        className
      )}
      style={{
        borderWidth: `${borderWidth}px`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      <div
        className="absolute aspect-square animate-border-beam"
        style={{
          width: `${size}px`,
          offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  );
}
