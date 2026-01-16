"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// SIGNUP
export const signUp = async (values: FormData) => {
    const name = values.get("name") as string;
    const email = values.get("email") as string;
    const password = values.get("password") as string;

    const isAlreadyExist = await prisma.user.count();

    if (isAlreadyExist > 0) {
        throw new Error("Admin creation is not allowed");
    }

    await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
        headers: await headers(),
    });
};

// SIGNIN
export const signIn = async (values: FormData) => {
    const email = values.get("email") as string;
    const password = values.get("password") as string;

    await auth.api.signInEmail({
        body: {
            email,
            password,
        },
        headers: await headers(),
    });
};

// SIGNOUT
export const signOut = async () => {
    await auth.api.signOut({
        headers: await headers(),
    });
};
