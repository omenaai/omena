import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getRequestSession } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getRequestSession();

  if (!session) {
    redirect("/auth?next=/app");
  }

  const displayName = session.name
    ?? (session.walletAddress
      ? `${session.walletAddress.slice(0, 4)}...${session.walletAddress.slice(-4)}`
      : "User");

  const user = {
    name: displayName,
    email: session.email ?? session.walletAddress ?? "",
  };

  return <AppShell user={user}>{children}</AppShell>;
}
