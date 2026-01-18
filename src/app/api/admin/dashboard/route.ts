import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const [
            totalDomains,
            totalOffers,
            closedDeals,
            potentialValueAggregate,
        ] = await Promise.all([
            prisma.domain.count(),
            prisma.offer.count(),
            prisma.offer.count({
                where: { status: "Closed" },
            }),

            prisma.domain.aggregate({
                _sum: {
                    buyNowPrice: true,
                    minOfferPrice: true,
                },
            }),
        ]);

        const totalPotentialValue =
            (potentialValueAggregate._sum.buyNowPrice ?? 0) +
            (potentialValueAggregate._sum.minOfferPrice ?? 0);

        const conversionRate =
            totalOffers > 0
                ? Number(((closedDeals / totalOffers) * 100).toFixed(1))
                : 0;

        return NextResponse.json({
            totalDomains,
            totalOffers,
            closedDeals,
            totalPotentialValue,
            conversionRate,
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: "Failed to fetch dashboard statistics",
                    error: error.message,
                },
                { status: 500 },
            );
        }
    }
}
