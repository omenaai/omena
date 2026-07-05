"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { SidebarNavGroup } from "@/components/app-shared";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({ label, items }: SidebarNavGroup) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	function isActive(path?: string) {
		if (!path) return false;

		const [targetPath, targetQuery] = path.split("?");
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
	}

	return (
		<SidebarGroup>
			{label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
			<SidebarMenu>
				{items.map((item) => {
					const active = isActive(item.path) || item.subItems?.some((s) => isActive(s.path));

					return (
						<Collapsible
							className="group/collapsible"
							defaultOpen={active}
							key={item.title}
							render={<SidebarMenuItem />}
						>
							{item.subItems?.length ? (
								<>
									<CollapsibleTrigger render={<SidebarMenuButton isActive={active} tooltip={item.title} />}>
										{item.icon}
										<span>{item.title}</span>
										<ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.subItems.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
														isActive={isActive(subItem.path)}
														render={<Link href={subItem.path ?? "#"} />}
													>
														{subItem.icon}
														<span>{subItem.title}</span>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								<SidebarMenuButton
									isActive={active}
									tooltip={item.title}
									render={<Link href={item.path ?? "#"} />}
								>
									{item.icon}
									<span>{item.title}</span>
								</SidebarMenuButton>
							)}
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
