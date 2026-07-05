"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import bs58 from "bs58";
import { AlertCircle, Loader2, Mail, ShieldCheck, UserPlus, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/Button";

type WalletSignInCardProps = {
  nextPath: string;
};

type AuthMode = "signin" | "register" | "wallet";

function getFriendlyAuthError(mode: AuthMode, message?: string) {
  const rawMessage = message?.trim();
  const normalized = rawMessage?.toLowerCase() ?? "";
  if (normalized.includes("support message signing")) return "This wallet cannot be used for sign-in here.";
  if (normalized.includes("nonce") || normalized.includes("challenge") || normalized.includes("expired")) return "Your sign-in request expired. Please try again.";
  if (normalized.includes("verification") || normalized.includes("signature")) return "We could not confirm your wallet. Please try again.";
  if (normalized.includes("unauthorized")) return "Your session has ended. Please sign in again.";
  if (normalized.includes("invalid email") || normalized.includes("email is invalid")) return "Please enter a valid email address.";
  if (normalized.includes("password") && normalized.includes("8")) return "Use a password with at least 8 characters.";
  if (normalized.includes("already exists") || normalized.includes("already been taken") || normalized.includes("already registered") || normalized.includes("user already exists")) return "This email is already in use.";
  if (normalized.includes("invalid email or password") || normalized.includes("account not found") || normalized.includes("invalid credentials")) return "Email or password is incorrect.";
  if (rawMessage && !normalized.includes("failed to fetch")) return rawMessage;
  return mode === "register"
    ? "Account creation could not be completed. Please try again."
    : mode === "wallet"
      ? "Wallet sign-in could not be completed. Please try again."
      : "Sign-in could not be completed. Please try again.";
}

function InputField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </label>
      <div className="flex h-11 items-center gap-3 border border-border bg-background px-3.5">
        <span className="text-muted-foreground/60 shrink-0">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/40"
        />
      </div>
    </div>
  );
}

const TABS: { id: AuthMode; label: string }[] = [
  { id: "signin", label: "Sign In" },
  { id: "register", label: "Register" },
  { id: "wallet", label: "Wallet" },
];

export function WalletSignInCard({ nextPath }: WalletSignInCardProps) {
  const router = useRouter();
  const { setVisible } = useWalletModal();
  const { connected, publicKey, signMessage, disconnect } = useWallet();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSigning, setIsSigning] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const walletAddress = publicKey?.toBase58() ?? "";

  const handleTabChange = (next: AuthMode) => {
    setMode(next);
    setError("");
  };

  const handleWalletSignIn = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }
    if (!signMessage) {
      setError("This wallet cannot be used for sign-in here.");
      return;
    }

    setError("");
    setIsSigning(true);

    try {
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      const noncePayload = (await nonceResponse.json()) as { message?: string; error?: string };
      if (!nonceResponse.ok || !noncePayload.message) throw new Error(noncePayload.error || "challenge_failed");

      const messageBytes = new TextEncoder().encode(noncePayload.message);
      const signatureBytes = await signMessage(messageBytes);
      const signature = bs58.encode(signatureBytes);

      const verifyResponse = await fetch("/api/auth/verify-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, signature }),
      });
      const verifyPayload = (await verifyResponse.json()) as { error?: string };
      if (!verifyResponse.ok) throw new Error(verifyPayload.error || "verification_failed");

      startTransition(() => {
        router.push(nextPath || "/app");
        router.refresh();
      });
    } catch (err) {
      setError(getFriendlyAuthError("wallet", err instanceof Error ? err.message : undefined));
    } finally {
      setIsSigning(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }
    if (mode === "register" && !fullName.trim()) { setError("Please enter your full name."); return; }

    setIsSubmittingEmail(true);

    try {
      const result = mode === "signin"
        ? await authClient.signIn.email({ email: email.trim(), password, callbackURL: nextPath || "/app", rememberMe: true })
        : await authClient.signUp.email({ name: fullName.trim(), email: email.trim(), password, callbackURL: nextPath || "/app" });

      if (result.error) { setError(getFriendlyAuthError(mode, result.error.message)); return; }

      startTransition(() => {
        router.push(nextPath || "/app");
        router.refresh();
      });
    } catch (err) {
      setError(getFriendlyAuthError(mode, err instanceof Error ? err.message : undefined));
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const isLoading = isSigning || isPending || isSubmittingEmail;

  return (
    <div className="w-full max-w-[400px] space-y-8">
      {/* Heading */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-black tracking-[-0.04em] text-foreground">
          {mode === "signin" ? "Welcome back" : mode === "register" ? "Create account" : "Connect wallet"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to your OMENA account."
            : mode === "register"
            ? "Start analyzing onchain data."
            : "Sign in using your Solana wallet."}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-colors ${
              mode === tab.id
                ? "border-b-2 border-foreground text-foreground -mb-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wallet tab */}
      {mode === "wallet" && (
        <div className="space-y-3">
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="w-full justify-center border-border text-[11px] font-black uppercase tracking-[0.18em] rounded-none"
            disabled={isLoading}
            onClick={handleWalletSignIn}
          >
            {isSigning || isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {connected ? "Sign message" : "Connect & sign"}
          </Button>

          {connected && (
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full justify-center border-border text-[11px] font-black uppercase tracking-[0.18em] rounded-none"
              onClick={() => disconnect()}
            >
              <Wallet className="h-4 w-4" />
              Disconnect
            </Button>
          )}

          {walletAddress && (
            <p className="truncate text-center text-[11px] font-medium text-muted-foreground">
              {walletAddress}
            </p>
          )}
        </div>
      )}

      {/* Email / Register tab */}
      {mode !== "wallet" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
          {mode === "register" && (
            <InputField
              label="Full name"
              icon={<UserPlus className="h-4 w-4" />}
              value={fullName}
              onChange={setFullName}
              placeholder="Your name"
              autoComplete="name"
            />
          )}

          <InputField
            label="Email"
            icon={<Mail className="h-4 w-4" />}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <InputField
            label="Password"
            icon={<ShieldCheck className="h-4 w-4" />}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full justify-center text-[11px] font-black uppercase tracking-[0.18em] rounded-none mt-2"
            disabled={isLoading}
          >
            {isSubmittingEmail || isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signin" ? (
              <Mail className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>

          {mode === "signin" && (
            <p className="text-center text-xs text-muted-foreground">
              No account?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className="font-semibold text-foreground underline-offset-2 hover:underline"
              >
                Register
              </button>
            </p>
          )}
        </form>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 border border-[color:rgba(186,26,26,0.25)] bg-[color:rgba(255,218,214,0.35)] px-3.5 py-3 text-sm font-medium text-foreground/90">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-error)]" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
