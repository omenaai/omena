"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
	AtSignIcon,
	ChevronLeftIcon,
	Loader2,
	ShieldCheck,
	UserPlus,
	Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { AuthDivider } from "@/components/auth-divider";
import { FloatingPaths } from "@/components/floating-paths";
import { GoogleIcon } from "@/components/google-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/Button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth/auth-client";

type AuthMode = "signin" | "register";

type AuthPageProps = {
	nextPath?: string;
};

function getFriendlyAuthError(mode: AuthMode, message?: string) {
	const rawMessage = message?.trim();
	const normalized = rawMessage?.toLowerCase() ?? "";

	if (normalized.includes("support message signing")) {
		return "This wallet cannot be used for sign-in here.";
	}
	if (normalized.includes("nonce") || normalized.includes("challenge") || normalized.includes("expired")) {
		return "Your sign-in request expired. Please try again.";
	}
	if (normalized.includes("verification") || normalized.includes("signature")) {
		return "We could not confirm your wallet. Please try again.";
	}
	if (normalized.includes("unauthorized")) {
		return "Your session has ended. Please sign in again.";
	}
	if (normalized.includes("invalid email") || normalized.includes("email is invalid")) {
		return "Please enter a valid email address.";
	}
	if (normalized.includes("password") && normalized.includes("8")) {
		return "Use a password with at least 8 characters.";
	}
	if (
		normalized.includes("already exists") ||
		normalized.includes("already been taken") ||
		normalized.includes("already registered") ||
		normalized.includes("user already exists")
	) {
		return "This email is already in use.";
	}
	if (
		normalized.includes("invalid email or password") ||
		normalized.includes("account not found") ||
		normalized.includes("invalid credentials")
	) {
		return "Email or password is incorrect.";
	}
	if (rawMessage && !normalized.includes("failed to fetch")) {
		return rawMessage;
	}

	return mode === "register"
		? "Account creation could not be completed. Please try again."
		: "Sign-in could not be completed. Please try again.";
}

export function AuthPage({ nextPath = "/app" }: AuthPageProps) {
	const router = useRouter();
	const { setVisible } = useWalletModal();
	const { connected, publicKey, signMessage } = useWallet();
	const [mode, setMode] = useState<AuthMode>("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [isPending, startTransition] = useTransition();
	const [isSigning, setIsSigning] = useState(false);
	const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
	const [isGooglePending, setIsGooglePending] = useState(false);

	const walletAddress = publicKey?.toBase58() ?? "";
	const isLoading = isSigning || isPending || isSubmittingEmail || isGooglePending;

	const handleTabChange = (nextMode: AuthMode) => {
		setMode(nextMode);
	};

	const redirectAfterAuth = () => {
		startTransition(() => {
			router.push(nextPath || "/app");
			router.refresh();
		});
	};

	const handleGoogleSignIn = async () => {
		setIsGooglePending(true);
		const toastId = toast.loading("Connecting to Google...");
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: nextPath || "/app",
			});
			toast.success("Redirecting...", { id: toastId });
		} catch (err) {
			toast.error(getFriendlyAuthError(mode, err instanceof Error ? err.message : undefined), { id: toastId });
			setIsGooglePending(false);
		}
	};

	const handleWalletSignIn = async () => {
		if (!publicKey) {
			setVisible(true);
			toast.info("Connect your wallet to continue.");
			return;
		}
		if (!signMessage) {
			toast.error("This wallet cannot be used for sign-in here.");
			return;
		}

		setIsSigning(true);
		const toastId = toast.loading("Waiting for wallet signature...");

		try {
			const nonceResponse = await fetch("/api/auth/nonce", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ walletAddress }),
			});
			const noncePayload = (await nonceResponse.json()) as {
				message?: string;
				error?: string;
			};

			if (!nonceResponse.ok || !noncePayload.message) {
				throw new Error(noncePayload.error || "challenge_failed");
			}

			toast.loading("Sign the message in your wallet...", { id: toastId });

			const messageBytes = new TextEncoder().encode(noncePayload.message);
			const signatureBytes = await signMessage(messageBytes);
			const signature = bs58.encode(signatureBytes);

			toast.loading("Verifying signature...", { id: toastId });

			const verifyResponse = await fetch("/api/auth/verify-wallet", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ walletAddress, signature }),
			});
			const verifyPayload = (await verifyResponse.json()) as { error?: string };

			if (!verifyResponse.ok) {
				throw new Error(verifyPayload.error || "verification_failed");
			}

			toast.success("Wallet verified! Signing in...", { id: toastId });
			redirectAfterAuth();
		} catch (err) {
			toast.error(
				getFriendlyAuthError(mode, err instanceof Error ? err.message : undefined),
				{ id: toastId },
			);
		} finally {
			setIsSigning(false);
		}
	};

	const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!email.trim()) {
			toast.error("Please enter your email.");
			return;
		}
		if (!password.trim()) {
			toast.error("Please enter your password.");
			return;
		}
		if (mode === "register" && !fullName.trim()) {
			toast.error("Please enter your full name.");
			return;
		}

		setIsSubmittingEmail(true);
		const toastId = toast.loading(mode === "signin" ? "Signing in..." : "Creating account...");

		try {
			const result =
				mode === "signin"
					? await authClient.signIn.email({
							email: email.trim(),
							password,
							callbackURL: nextPath || "/app",
							rememberMe: true,
						})
					: await authClient.signUp.email({
							name: fullName.trim(),
							email: email.trim(),
							password,
							callbackURL: nextPath || "/app",
						});

			if (result.error) {
				toast.error(getFriendlyAuthError(mode, result.error.message), { id: toastId });
				return;
			}

			toast.success(
				mode === "signin" ? "Welcome back!" : "Account created! Welcome to Omena.",
				{ id: toastId },
			);
			redirectAfterAuth();
		} catch (err) {
			toast.error(
				getFriendlyAuthError(mode, err instanceof Error ? err.message : undefined),
				{ id: toastId },
			);
		} finally {
			setIsSubmittingEmail(false);
		}
	};

	return (
		<main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
			<div className="relative hidden h-full flex-col border-r bg-secondary p-10 lg:flex dark:bg-secondary/20">
				<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
				<Logo className="mr-auto h-12" />

				<div className="z-10 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-xl">
							&ldquo;Omena&apos;s behavior signals flagged a suspicious holder
							pattern two hours before the exit. The onchain context it surfaces
							is unlike anything else in the space.&rdquo;
						</p>
						<footer className="font-mono font-semibold text-sm">
							~ Marcus T., Crypto Fund Manager
						</footer>
					</blockquote>
				</div>
				<div className="absolute inset-0">
					<FloatingPaths position={1} />
					<FloatingPaths position={-1} />
				</div>
			</div>

			<div className="relative flex min-h-screen flex-col justify-center px-8">
				<div
					aria-hidden
					className="absolute inset-0 isolate -z-10 opacity-60 contain-strict"
				>
					<div className="absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
					<div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
					<div className="absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
				</div>

				<Button
					className="absolute top-7 left-5"
					variant="ghost"
					render={<Link href="/" />}
					nativeButton={false}
				>
					<ChevronLeftIcon data-icon="inline-start" />
					Home
				</Button>

				<div className="mx-auto space-y-4 sm:w-sm">
					<Logo className="h-12 lg:hidden" />
					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">
							{mode === "signin" ? "Sign In" : "Create Account"}
						</h1>
						<p className="text-base text-muted-foreground">
							{mode === "signin"
								? "Sign in to your OMENA account."
								: "Start analyzing onchain data."}
						</p>
					</div>

					<form className="space-y-3" onSubmit={handleEmailSubmit} noValidate>
						{mode === "register" && (
							<div className="space-y-1">
								<label htmlFor="fullName" className="text-sm font-medium">
									Full Name
								</label>
								<InputGroup>
									<InputGroupInput
										id="fullName"
										autoComplete="name"
										onChange={(event) => setFullName(event.target.value)}
										placeholder="Your name"
										value={fullName}
									/>
									<InputGroupAddon align="inline-start">
										<UserPlus />
									</InputGroupAddon>
								</InputGroup>
							</div>
						)}
						<div className="space-y-1">
							<label htmlFor="email" className="text-sm font-medium">
								Email
							</label>
							<InputGroup>
								<InputGroupInput
									id="email"
									autoComplete="email"
									onChange={(event) => setEmail(event.target.value)}
									placeholder="your.email@example.com"
									type="email"
									value={email}
								/>
								<InputGroupAddon align="inline-start">
									<AtSignIcon />
								</InputGroupAddon>
							</InputGroup>
						</div>
						<div className="space-y-1">
							<label htmlFor="password" className="text-sm font-medium">
								Password
							</label>
							<InputGroup>
								<InputGroupInput
									id="password"
									autoComplete={mode === "signin" ? "current-password" : "new-password"}
									onChange={(event) => setPassword(event.target.value)}
									placeholder="Password"
									type="password"
									value={password}
								/>
								<InputGroupAddon align="inline-start">
									<ShieldCheck />
								</InputGroupAddon>
							</InputGroup>
						</div>

						<Button className="w-full" disabled={isLoading} type="submit">
							{isSubmittingEmail || isPending ? (
								<Loader2 className="animate-spin" data-icon="inline-start" />
							) : mode === "signin" ? (
								<AtSignIcon data-icon="inline-start" />
							) : (
								<UserPlus data-icon="inline-start" />
							)}
							{mode === "signin" ? "Sign In" : "Create Account"}
						</Button>
					</form>

					<AuthDivider>OR</AuthDivider>

					<Button
						className="w-full"
						type="button"
						variant="outline"
						disabled={isLoading}
						onClick={handleWalletSignIn}
					>
						{isSigning ? (
							<Loader2 className="animate-spin" data-icon="inline-start" />
						) : (
							<Wallet data-icon="inline-start" />
						)}
						{connected ? "Sign Message" : "Continue With Wallet"}
					</Button>

					{walletAddress && (
						<p className="truncate text-center text-muted-foreground text-xs">
							{walletAddress}
						</p>
					)}

					<Button
						className="w-full"
						type="button"
						variant="outline"
						disabled={isLoading}
						onClick={handleGoogleSignIn}
					>
						{isGooglePending ? (
							<Loader2 className="animate-spin" data-icon="inline-start" />
						) : (
							<GoogleIcon className="h-4 w-4" data-icon="inline-start" />
						)}
						Continue with Google
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						{mode === "signin" ? (
							<>
								Don&apos;t have an account?{" "}
								<button
									type="button"
									onClick={() => handleTabChange("register")}
									className="font-medium underline underline-offset-4 hover:text-primary"
								>
									Create an account
								</button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<button
									type="button"
									onClick={() => handleTabChange("signin")}
									className="font-medium underline underline-offset-4 hover:text-primary"
								>
									Sign in
								</button>
							</>
						)}
					</p>

					<p className="mt-4 text-muted-foreground text-sm">
						By clicking continue, you agree to our{" "}
						<a className="underline underline-offset-4 hover:text-primary" href="#">
							Terms of Service
						</a>{" "}
						and{" "}
						<a className="underline underline-offset-4 hover:text-primary" href="#">
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</main>
	);
}
