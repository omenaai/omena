import React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

interface InteractiveHoverButtonProps extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  children: React.ReactNode
  variant?: "primary" | "white"
}

export function InteractiveHoverButton({
  children,
  className,
  variant = "primary",
  ...props
}: InteractiveHoverButtonProps) {
  const isWhite = variant === "white";
  return (
    <Button
      variant="ghost"
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full px-6 py-2.5 text-center font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95",
        isWhite
          ? "bg-primary-foreground text-primary hover:text-primary"
          : "bg-card text-primary hover:text-primary-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {/* Animated growing bubble */}
        <div className={cn(
          "h-2 w-2 rounded-full transition-all duration-500 ease-out group-hover:scale-[35.5]",
          isWhite ? "bg-white" : "bg-primary"
        )}></div>
        
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className={cn(
        "absolute inset-0 z-10 flex items-center justify-center gap-1.5 opacity-0 transition-all duration-300 translate-x-8 group-hover:translate-x-0 group-hover:opacity-100",
        isWhite ? "text-primary" : "text-primary-foreground"
      )}>
        <span>{children}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Button>
  )
}
