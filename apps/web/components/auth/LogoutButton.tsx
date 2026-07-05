"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="bg-card text-[10px] font-black uppercase tracking-[0.18em]"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await Promise.allSettled([
            authClient.signOut(),
            fetch("/api/auth/logout", { method: "POST" }),
          ]);
          router.push("/auth");
          router.refresh();
        });
      }}
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
      Logout
    </Button>
  );
}
