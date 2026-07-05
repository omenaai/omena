"use client";

import Link from "next/link";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	UserIcon,
	KeyIcon,
	CreditCardIcon,
	LogOutIcon,
	BookOpenIcon,
	LifeBuoyIcon,
} from "lucide-react";

export type NavUserProps = {
	name: string;
	email: string;
	avatar?: string;
};

export function NavUser({ name, email, avatar }: NavUserProps) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Avatar className="size-8 cursor-pointer ring-2 ring-border hover:ring-primary/40 transition-all" />}>
				{avatar && <AvatarImage src={avatar} alt={name} />}
				<AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel className="p-0">
					<div className="flex items-center gap-3 p-3">
						<Avatar className="size-10">
							{avatar && <AvatarImage src={avatar} alt={name} />}
							<AvatarFallback className="text-xs font-bold">{initials}</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<p className="truncate font-semibold text-sm text-foreground">{name}</p>
							<p className="truncate text-xs text-muted-foreground">{email}</p>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem render={<Link href="/app/settings" />}>
						<UserIcon />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="/app/settings?tab=api" />}>
						<KeyIcon />
						API Keys
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="/app/settings?tab=billing" />}>
						<CreditCardIcon />
						Billing
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem render={<Link href="/docs" />}>
						<BookOpenIcon />
						Documentation
					</DropdownMenuItem>
					<DropdownMenuItem render={<Link href="/docs" />}>
						<LifeBuoyIcon />
						Support
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					render={<Link href="/api/auth/logout" />}
				>
					<LogOutIcon />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
