import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import type { NavUserProps } from "@/components/nav-user";

type AppShellProps = {
	children: React.ReactNode;
	user: NavUserProps;
};

export function AppShell({ children, user }: AppShellProps) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "196px",
					"--sidebar-width-icon": "3rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar user={user} />
			<SidebarInset className="min-h-screen bg-background/72 p-3 md:p-5">
				<AppHeader />
				<div className="flex flex-1 flex-col">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
