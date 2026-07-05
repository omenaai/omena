"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { navLinks } from "@/components/app-shared";
import { BellIcon, ArrowUpRightIcon } from "lucide-react";

function useActivePage() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	return navLinks.find((item) => {
		if (!item.path) return false;

		const [targetPath, targetQuery] = item.path.split("?");
		const pathMatches =
			targetPath === "/app"
				? pathname === "/app"
				: pathname === targetPath || pathname.startsWith(targetPath + "/");

		if (!pathMatches) return false;
		if (!targetQuery) return true;

		const targetParams = new URLSearchParams(targetQuery);
		for (const [key, value] of targetParams.entries()) {
			if (searchParams.get(key) !== value) return false;
		}

		return true;
	}) ?? null;
}

export function AppHeader() {
	const activePage = useActivePage();

	return (
		<header
			className={cn(
				"sticky top-3 z-20 mb-5 flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-card/88 px-3 py-2 shadow-[var(--shadow-ambient)] backdrop-blur md:px-4",
			)}
		>
			<div className="flex items-center gap-3">
				<CustomSidebarTrigger />
				<Separator
					className="mr-2 h-4 data-[orientation=vertical]:self-center"
					orientation="vertical"
				/>
				<AppBreadcrumbs page={activePage} />
			</div>
			<div className="flex items-center gap-2">
				<Button
					aria-label="Go to landing page"
					size="sm"
					variant="ghost"
					className="hidden text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:flex"
					render={<Link href="/" />}
					nativeButton={false}
				>
					Home
					<ArrowUpRightIcon className="h-3 w-3" />
				</Button>
				<Button aria-label="Notifications" size="icon" variant="ghost">
					<BellIcon />
				</Button>
			</div>
		</header>
	);
}
