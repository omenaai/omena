"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateSolanaTokenAddress } from "@/lib/intelligence/validation";
import { demoTokenAddress } from "@/lib/intelligence/mock-analysis";

type TokenInputFormProps = {
  defaultValue?: string;
  showHeader?: boolean;
};

export function TokenInputForm({ defaultValue = "", showHeader = true }: TokenInputFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const validation = useMemo(() => {
    if (!value.trim()) {
      return null;
    }

    return validateSolanaTokenAddress(value);
  }, [value]);

  const submit = (tokenAddress: string) => {
    startTransition(() => {
      router.push(`/app/analyze?token=${encodeURIComponent(tokenAddress.trim())}`);
    });
  };

  return (
    <div className="rounded-[24px] border border-border/70 bg-background/72 p-4 sm:p-5">
      {showHeader ? (
        <div className="mb-4 space-y-1.5">
          <h2 className="font-display text-xl font-black tracking-[-0.05em] text-foreground sm:text-2xl">
            Analyze a Solana token
          </h2>
          <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground">
            Risk, behavior, signal, and context in one report.
          </p>
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const result = validateSolanaTokenAddress(value);

          if (!result.ok) {
            setError(result.message);
            return;
          }

          setError("");
          submit(result.value);
        }}
        className="space-y-3"
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-[18px] border border-border/70 bg-card px-4 transition-colors focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="h-4 w-4 text-primary" />
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Enter Solana token address"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </label>

          <Button type="submit" size="lg" className="min-w-40 rounded-[18px] text-[11px] font-black uppercase tracking-[0.18em]" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Analyze
          </Button>
        </div>

        <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            {error ? (
              <p className="font-semibold text-[var(--color-error)]">{error}</p>
            ) : validation && !validation.ok ? (
              <p className="font-semibold text-[var(--color-error)]">{validation.message}</p>
            ) : (
              <p className="font-medium text-muted-foreground">Use a Solana mint address or open the demo token.</p>
            )}
          </div>

          <button
            type="button"
            className="text-left font-semibold text-primary transition-colors hover:text-[var(--omena-primary-dark)]"
            onClick={() => {
              setValue(demoTokenAddress);
              setError("");
              submit(demoTokenAddress);
            }}
          >
            Use demo token
          </button>
        </div>
      </form>
    </div>
  );
}
