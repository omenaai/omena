import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { getRequestSession } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getRequestSession();

  if (!session) {
    redirect("/auth?next=/app");
  }

  return <AppShell>{children}</AppShell>;
}
