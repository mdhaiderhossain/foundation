"use client";

import * as React from "react";
import { DollarSign, Package, TrendingUp, Users, Loader } from "lucide-react";
import { StatsCard } from "./_components/stats-card";
import { RecentSales } from "./_components/recent-sales";
import { useDashboardStats } from "./_hooks/use-dashboard-api";

export default function DashboardInterface() {
    const { data: stats, isLoading } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-5rem)] grid place-items-center">
                <div className="text-muted-foreground animate-pulse text-lg">
                    <Loader className="animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full xl:w-10/12 2xl:w-8/12 mx-auto">
            {/* Header */}
            <div className="pt-4">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your domain portfolio and sales performance
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Domains"
                    value={stats?.totalDomains || 0}
                    icon={Package}
                    description="Active domains in portfolio"
                />
                <StatsCard
                    title="Total Potential Value"
                    value={new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                    }).format(stats?.totalPotentialValue || 0)}
                    icon={DollarSign}
                    description="Sum of all domain prices"
                />
                <StatsCard
                    title="Total Offers"
                    value={stats?.totalOffers || 0}
                    icon={Users}
                    description="All-time offer count"
                />
                <StatsCard
                    title="Conversion Rate"
                    value={`${stats?.conversionRate || 0}%`}
                    icon={TrendingUp}
                    description={`${stats?.closedDeals || 0} closed deals`}
                />
            </div>

            {/* Recent Sales */}
            <RecentSales />
        </div>
    );
}
