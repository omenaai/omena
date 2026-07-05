import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button";

interface ShinyButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export function ShinyButton({
  children,
  className,
  ...props
}: ShinyButtonProps) {
  return (
    <Button
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-full bg-primary bg-[length:200%_100%] px-6 py-2.5 text-center font-bold text-xs uppercase tracking-wider text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 animate-shine",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5">{children}</span>
    </Button>
  );
}
