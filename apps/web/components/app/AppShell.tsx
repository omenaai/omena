import { getRequestSession } from "@/lib/auth/session";
import type { ReactNode } from "react";
import { AppShellFrame } from "@/components/app/AppShellFrame";

type AppShellProps = {
  children: ReactNode;
};

function formatIdentity(session: Awaited<ReturnType<typeof getRequestSession>>) {
  if (!session) {
    return "No Session";
  }

  if (session.walletAddress) {
    return `${session.walletAddress.slice(0, 4)}...${session.walletAddress.slice(-4)}`;
  }

  if (session.email) {
    return session.email;
  }

  return session.name || "Signed In";
}

export async function AppShell({ children }: AppShellProps) {
  const session = await getRequestSession();

  return <AppShellFrame identity={formatIdentity(session)}>{children}</AppShellFrame>;
}
