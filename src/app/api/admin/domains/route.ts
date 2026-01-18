import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// ============================================
// GET - List all domains (with basic pagination)
// ============================================
export async function GET(req: Request) {
    try {
        // Check authentication
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        // Get pagination from URL
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        // Fetch domains with pagination
        const domains = await prisma.domain.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                buyNowPrice: true,
                minOfferPrice: true,
                industries: true,
                keywords: true,
                isFeatured: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                // Get counts instead of all related data
                _count: {
                    select: {
                        ideas: true,
                        reports: true,
                        brandingPackages: true,
                        offers: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: skip,
            take: limit,
        });

        return NextResponse.json(domains);
    } catch (error) {
        console.error("Failed to fetch domains:", error);
        return NextResponse.json(
            { message: "Failed to fetch domains" },
            { status: 500 },
        );
    }
}

// ============================================
// POST - Create a new domain
// ============================================
export async function POST(req: Request) {
    try {
        // Check authentication
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await req.json();

        // Basic validation
        if (!body.name || !body.slug) {
            return NextResponse.json(
                { message: "Name and slug are required" },
                { status: 400 },
            );
        }

        // Check if slug already exists
        const existingDomain = await prisma.domain.findUnique({
            where: { slug: body.slug },
        });

        if (existingDomain) {
            return NextResponse.json(
                { message: "Domain with this slug already exists" },
                { status: 409 },
            );
        }

        // Create the domain
        const domain = await prisma.domain.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description || null,
                buyNowPrice: body.buyNowPrice || null,
                minOfferPrice: body.minOfferPrice || null,
                industries: body.industries || [],
                keywords: body.keywords || [],
                isFeatured: body.isFeatured || false,
                status: body.status || "available",
            },
        });

        return NextResponse.json(domain, { status: 201 });
    } catch (error) {
        console.error("Failed to create domain:", error);
        return NextResponse.json(
            { message: "Failed to create domain" },
            { status: 500 },
        );
    }
}
