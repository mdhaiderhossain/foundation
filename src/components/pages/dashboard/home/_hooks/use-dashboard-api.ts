"use client";

import { useQuery } from "@tanstack/react-query";

export type DashboardStats = {
    totalDomains: number;
    totalOffers: number;
    closedDeals: number;
    totalPotentialValue: number;
    conversionRate: number;
};

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "An error occurred" }));
        throw new Error(error.message || "An error occurred");
    }
    return response.json();
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const response = await fetch("/api/admin/dashboard", {
                cache: "no-store",
            });
            return handleResponse(response) as Promise<DashboardStats>;
        },
    });
}

// Hook to fetch recent closed offers
export function useRecentSales() {
    return useQuery({
        queryKey: ["recent-sales"],
        queryFn: async () => {
            const response = await fetch("/api/admin/offers", {
                cache: "no-store",
            });
            const offers = await handleResponse(response);
            // Filter and sort closed offers
            return offers
                .filter((offer: any) => offer.status.toLowerCase() === "closed")
                .sort(
                    (a: any, b: any) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                )
                .slice(0, 5);
        },
    });
}
