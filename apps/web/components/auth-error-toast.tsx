"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ERROR_MESSAGES: Record<string, string> = {
  account_not_linked: "This email is already registered with a different sign-in method.",
  oauth_access_denied: "Access was denied. Please try again.",
  invalid_state: "Sign-in session expired. Please try again.",
  session_expired: "Your session has expired. Please sign in again.",
  unknown: "Something went wrong. Please try again.",
};

export function AuthErrorToast({ error }: { error?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!error) return;
    const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.unknown;
    toast.error(message);
    // Clean the error param from the URL without a full navigation
    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    router.replace(url.pathname + (url.search || ""), { scroll: false });
  }, [error, router]);

  return null;
}
