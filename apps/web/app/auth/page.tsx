import Link from "next/link";
import { Clock3 } from "lucide-react";
import { AuthErrorToast } from "@/components/auth-error-toast";
import { AuthPage as AuthPageContent } from "@/components/auth-page";
import { Badge } from "@/components/ui/Badge";

type AuthPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

function getSafeNextPath(nextPath?: string) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/app";
  }

  return nextPath;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);
  const authError = params.error;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return (
      <>
        <AuthErrorToast error={authError} />
        <AuthPageContent nextPath={nextPath} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-8 py-6 lg:px-12">
        <Link
          href="/"
          className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-8 py-10">
        <div className="w-full max-w-xl rounded-[28px] border border-border/70 bg-card/92 p-8 text-center shadow-[var(--shadow-ambient)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Clock3 className="h-5 w-5" />
          </div>
          <Badge className="mt-5 bg-primary/10 text-primary">
            Temporarily Closed
          </Badge>
          <h1 className="mt-4 font-display text-3xl font-black tracking-tighter text-foreground">
            Sign in and sign up are paused for now.
          </h1>
          <p className="mt-3 text-sm font-medium leading-7 text-muted-foreground">
            Access to the dashboard is limited outside localhost while the MVP is being finalized.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-xs font-black uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Docs
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-xs font-black uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
            >
              View Roadmap
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
