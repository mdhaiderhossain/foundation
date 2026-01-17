"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginFormSchema, singupFormSchema } from "@/schemas/auth.schema";
import { headers } from "next/headers";
import z from "zod";

// SIGNUP
export const signUp = async (values: z.infer<typeof singupFormSchema>) => {
    const { name, email, password } = values;

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
export const signIn = async (values: z.infer<typeof loginFormSchema>) => {
    const { email, password } = values;

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
