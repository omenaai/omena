import type { ReactNode } from "react";
import {
	LayoutDashboardIcon,
	ScanSearchIcon,
	TrendingUpIcon,
	BookOpenIcon,
	FileTextIcon,
	SettingsIcon,
	LifeBuoyIcon,
	ActivityIcon,
} from "lucide-react";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Workspace",
		items: [
			{
				title: "Dashboard",
				path: "/app",
				icon: <LayoutDashboardIcon />,
			},
			{
				title: "Analyze",
				path: "/app/analyze",
				icon: <ScanSearchIcon />,
			},
		],
	},
	{
		label: "Market",
		items: [
			{
				title: "Overview",
				path: "/app/market",
				icon: <TrendingUpIcon />,
				subItems: [
					{ title: "Top Tokens", path: "/app/market?tab=top-tokens" },
					{ title: "Trending", path: "/app/market?tab=trending" },
					{ title: "Watchlist", path: "/app/market?tab=watchlist" },
				],
			},
		],
	},
	{
		label: "Resources",
		items: [
			{
				title: "Docs",
				path: "/docs",
				icon: <BookOpenIcon />,
			},
			{
				title: "Litepaper",
				path: "/litepaper",
				icon: <FileTextIcon />,
			},
		],
	},
	{
		label: "Account",
		items: [
			{
				title: "Settings",
				path: "/app/settings",
				icon: <SettingsIcon />,
				subItems: [
					{ title: "Profile", path: "/app/settings" },
					{ title: "API Keys", path: "/app/settings?tab=api" },
					{ title: "Billing", path: "/app/settings?tab=billing" },
				],
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Help & Support",
		path: "/docs",
		icon: <LifeBuoyIcon />,
	},
	{
		title: "Platform Status",
		path: "/status",
		icon: <ActivityIcon />,
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item],
		),
	),
	...footerNavLinks,
];
