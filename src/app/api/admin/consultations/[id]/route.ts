import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET - Get a single consultation
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

        const consultation = await prisma.consultation.findUnique({
            where: { id },
            include: {
                offer: {
                    include: {
                        domain: true,
                    },
                },
            },
        });

        if (!consultation) {
            return NextResponse.json(
                { message: "Consultation not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(consultation);
    } catch (error) {
        console.error("Failed to fetch consultation:", error);
        return NextResponse.json(
            { message: "Failed to fetch consultation" },
            { status: 500 },
        );
    }
}

// PATCH - Update a consultation
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

        // Check if consultation exists
        const existing = await prisma.consultation.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Consultation not found" },
                { status: 404 },
            );
        }

        // Update consultation
        const consultation = await prisma.consultation.update({
            where: { id },
            data: {
                ...(body.scheduled !== undefined && {
                    scheduled: body.scheduled,
                }),
                ...(body.completed !== undefined && {
                    completed: body.completed,
                }),
                ...(body.followUpDelivered !== undefined && {
                    followUpDelivered: body.followUpDelivered,
                }),
                ...(body.notes !== undefined && { notes: body.notes }),
                ...(body.deckWriting !== undefined && {
                    deckWriting: body.deckWriting,
                }),
                ...(body.productBuild !== undefined && {
                    productBuild: body.productBuild,
                }),
                ...(body.referrals !== undefined && {
                    referrals: body.referrals,
                }),
                ...(body.investorIntros !== undefined && {
                    investorIntros: body.investorIntros,
                }),
                ...(body.revenueShare !== undefined && {
                    revenueShare: body.revenueShare,
                }),
            },
        });

        return NextResponse.json(consultation);
    } catch (error) {
        console.error("Failed to update consultation:", error);
        return NextResponse.json(
            { message: "Failed to update consultation" },
            { status: 500 },
        );
    }
}

// DELETE - Delete a consultation
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

        // Check if exists
        const existing = await prisma.consultation.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Consultation not found" },
                { status: 404 },
            );
        }

        // Delete it
        await prisma.consultation.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Consultation deleted" });
    } catch (error) {
        console.error("Failed to delete consultation:", error);
        return NextResponse.json(
            { message: "Failed to delete consultation" },
            { status: 500 },
        );
    }
}
