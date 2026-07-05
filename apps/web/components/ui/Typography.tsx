import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "hero" | "section" | "card";
};

export function Heading({ as = "h2", size = "section", className, children, ...props }: HeadingProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "font-display text-balance font-black tracking-[-0.045em] text-foreground",
        size === "hero" && "text-4xl leading-[0.94] sm:text-5xl lg:text-7xl",
        size === "section" && "text-2xl leading-[1] sm:text-3xl lg:text-5xl",
        size === "card" && "text-base leading-tight sm:text-lg lg:text-xl",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Subheading({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-pretty text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7", className)} {...props}>
      {children}
    </p>
  );
}

export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <Badge variant="secondary" className={cn("mb-2 h-auto bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary", className)} {...props}>
      {children}
    </Badge>
  );
}
