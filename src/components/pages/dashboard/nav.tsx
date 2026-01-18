"use client";
import Link from "next/link";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Nav({
    menu,
}: {
    menu: {
        name: string;
        url: string;
        icon: LucideIcon;
    }[];
}) {
    const path = usePathname();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>MAIN</SidebarGroupLabel>
            <SidebarMenu>
                {menu.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            asChild
                            className={cn(
                                "transition-colors duration-200 hover:bg-accent-foreground hover:text-accent",
                                item.url === path
                                    ? "bg-accent-foreground text-accent"
                                    : "",
                            )}
                        >
                            <Link href={item.url} className="text-lg">
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
