"use client";

import Link from "next/link";
import { ScanSearchIcon } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { LatestChange } from "@/components/latest-change";
import { Logo, LogoIcon } from "@/components/logo";
import { NavUser, type NavUserProps } from "@/components/nav-user";

type AppSidebarProps = {
	user: NavUserProps;
};

export function AppSidebar({ user }: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" variant="floating">
			<SidebarHeader className="h-14 justify-center px-3">
				<SidebarMenuButton
					className="h-10 gap-2 rounded-2xl data-[collapsible=icon]:justify-center"
					render={<Link href="/" aria-label="OMENA home" />}
					tooltip="OMENA"
				>
					<Logo className="h-10 w-10 group-data-[collapsible=icon]:hidden" priority />
					<LogoIcon className="hidden size-7 group-data-[collapsible=icon]:block" priority />
				</SidebarMenuButton>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground font-semibold"
								tooltip="New Analysis"
								render={<Link href="/app/analyze" />}
							>
								<ScanSearchIcon />
								<span>New Analysis</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				{navGroups.map((group, index) => (
					<NavGroup key={`nav-group-${index}`} {...group} />
				))}
			</SidebarContent>

			<SidebarFooter>
				<LatestChange />
				<SidebarMenu className="mt-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								className="text-muted-foreground"
								size="sm"
								tooltip={item.title}
								render={<Link href={item.path ?? "#"} />}
							>
								{item.icon}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<div className="flex items-center justify-between gap-2 px-1 py-2 group-data-[collapsible=icon]:justify-center">
					<div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
						<span className="truncate text-xs font-semibold">{user.name}</span>
						<span className="truncate text-[10px] text-muted-foreground">{user.email}</span>
					</div>
					<NavUser {...user} />
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
