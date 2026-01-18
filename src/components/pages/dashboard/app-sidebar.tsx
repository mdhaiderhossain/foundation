"use client";

import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    CirclePercent,
    Command,
    DollarSign,
    Frame,
    GalleryVerticalEnd,
    Globe,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
    Users,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Nav } from "./nav";

// This is sample data.
const data = {
    main: [
        {
            name: "Dashboard",
            url: "/dashboard",
            icon: Frame,
        },
        {
            name: "Domains",
            url: "/dashboard/domains",
            icon: Globe,
        },
        {
            name: "Offers",
            url: "/dashboard/offers",
            icon: CirclePercent,
        },
        {
            name: "Consultations",
            url: "/dashboard/consultations",
            icon: Users,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader></SidebarHeader>
            <SidebarContent>
                <Nav menu={data.main} />
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
