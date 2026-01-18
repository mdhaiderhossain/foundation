import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET - List all consultations
export async function GET(req: Request) {
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

        const consultations = await prisma.consultation.findMany({
            include: {
                offer: {
                    include: {
                        domain: true,
                    },
                },
            },
            orderBy: {
                offer: {
                    createdAt: "desc",
                },
            },
        });

        return NextResponse.json(consultations);
    } catch (error) {
        console.error("Failed to fetch consultations:", error);
        return NextResponse.json(
            { message: "Failed to fetch consultations" },
            { status: 500 },
        );
    }
}

// POST - Create a new consultation
export async function POST(req: Request) {
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

        const body = await req.json();

        // Validate required field
        if (!body.offerId) {
            return NextResponse.json(
                { message: "Offer ID is required" },
                { status: 400 },
            );
        }

        // Check if offer exists
        const offer = await prisma.offer.findUnique({
            where: { id: body.offerId },
        });

        if (!offer) {
            return NextResponse.json(
                { message: "Offer not found" },
                { status: 404 },
            );
        }

        // Check if consultation already exists for this offer
        const existingConsultation = await prisma.consultation.findUnique({
            where: { offerId: body.offerId },
        });

        if (existingConsultation) {
            return NextResponse.json(
                { message: "Consultation already exists for this offer" },
                { status: 409 },
            );
        }

        // Create consultation
        const consultation = await prisma.consultation.create({
            data: {
                offerId: body.offerId,
                scheduled: body.scheduled ?? false,
                completed: body.completed ?? false,
                followUpDelivered: body.followUpDelivered ?? false,
                notes: body.notes ?? null,
                deckWriting: body.deckWriting ?? false,
                productBuild: body.productBuild ?? false,
                referrals: body.referrals ?? false,
                investorIntros: body.investorIntros ?? false,
                revenueShare: body.revenueShare ?? null,
            },
        });

        return NextResponse.json(consultation, { status: 201 });
    } catch (error) {
        console.error("Failed to create consultation:", error);
        return NextResponse.json(
            { message: "Failed to create consultation" },
            { status: 500 },
        );
    }
}
