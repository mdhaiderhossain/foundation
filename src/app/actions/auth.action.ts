"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginFormSchema, singupFormSchema } from "@/schemas/auth.schema";
import { headers } from "next/headers";
import z from "zod";

// SIGNUP
export const signUp = async (values: z.infer<typeof singupFormSchema>) => {
    try {
        const { name, email, password } = values;

        const isAlreadyExist = await prisma.user.count();

        if (isAlreadyExist > 0) {
            throw new Error("Admin creation is not allowed");
        }

        const response = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
            headers: await headers(),
        });

        return { success: true, data: response };
    } catch (error) {
        console.error("Signin error:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Invalid credentials",
        };
    }
};

// SIGNIN
export const signIn = async (values: z.infer<typeof loginFormSchema>) => {
    try {
        const { email, password } = values;

        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
            headers: await headers(),
        });

        return { success: true, data: response };
    } catch (error) {
        console.error("Signin error:", error);
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Invalid credentials",
        };
    }
};
// SIGNOUT
export const signOut = async () => {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });
        return { success: true };
    } catch (error) {
        console.error("Signout error:", error);
        return {
            success: false,
            error: "Signout failed",
        };
    }
};
