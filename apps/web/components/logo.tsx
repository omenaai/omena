import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
	className?: string;
	priority?: boolean;
};

export function Logo({ className, priority }: LogoProps) {
	return (
		<Image
			src="/logo.png"
			alt="OMENA"
			width={132}
			height={54}
			priority={priority}
			className={cn("w-auto object-contain", className)}
		/>
	);
}

export function LogoIcon({ className, priority }: LogoProps) {
	return (
		<Image
			src="/icon.png"
			alt="OMENA"
			width={52}
			height={52}
			priority={priority}
			className={cn("object-contain", className)}
		/>
	);
}
