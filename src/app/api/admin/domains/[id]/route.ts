import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET - Get single domain
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
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

        const { id } = await params;

        // Find by ID or slug
        const domain = await prisma.domain.findFirst({
            where: {
                OR: [{ id }, { slug: id }],
            },
            include: {
                ideas: true,
                reports: true,
                brandingPackages: true,
                offers: true,
            },
        });

        if (!domain) {
            return NextResponse.json(
                { message: "Domain not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(domain);
    } catch (error) {
        console.error("Failed to fetch domain:", error);
        return NextResponse.json(
            { message: "Failed to fetch domain" },
            { status: 500 },
        );
    }
}

// PATCH - Update domain
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
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

        const { id } = await params;
        const body = await req.json();

        // Find domain first
        const existing = await prisma.domain.findFirst({
            where: {
                OR: [{ id }, { slug: id }],
            },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Domain not found" },
                { status: 404 },
            );
        }

        // Update domain
        const domain = await prisma.domain.update({
            where: { id: existing.id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.slug && { slug: body.slug }),
                ...(body.description !== undefined && {
                    description: body.description,
                }),
                ...(body.buyNowPrice !== undefined && {
                    buyNowPrice: body.buyNowPrice,
                }),
                ...(body.minOfferPrice !== undefined && {
                    minOfferPrice: body.minOfferPrice,
                }),
                ...(body.industries && { industries: body.industries }),
                ...(body.keywords && { keywords: body.keywords }),
                ...(body.isFeatured !== undefined && {
                    isFeatured: body.isFeatured,
                }),
                ...(body.status && { status: body.status }),
            },
        });

        return NextResponse.json(domain);
    } catch (error) {
        console.error("Failed to update domain:", error);
        return NextResponse.json(
            { message: "Failed to update domain" },
            { status: 500 },
        );
    }
}

// DELETE - Delete domain
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
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

        const { id } = await params;

        // Find domain first
        const existing = await prisma.domain.findFirst({
            where: {
                OR: [{ id }, { slug: id }],
            },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Domain not found" },
                { status: 404 },
            );
        }

        // Delete it
        await prisma.domain.delete({
            where: { id: existing.id },
        });

        return NextResponse.json({ message: "Domain deleted" });
    } catch (error) {
        console.error("Failed to delete domain:", error);
        return NextResponse.json(
            { message: "Failed to delete domain" },
            { status: 500 },
        );
    }
}
