import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const offers = await prisma.offer.findMany({
        include: { domain: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(offers);
}

export async function PATCH(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const offer = await prisma.offer.update({
        where: { id: body.id },
        data: {
            status: body.status,
            notes: body.notes,
        },
    });

    return NextResponse.json(offer);
}
