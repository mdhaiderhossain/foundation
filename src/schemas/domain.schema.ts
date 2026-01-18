import { z } from "zod";

export const domainFormSchema = z.object({
    name: z
        .string()
        .min(1, "Domain name is required")
        .regex(
            /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/i,
            "Please enter a valid domain name (e.g., example.com)",
        ),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(
            /^[a-z0-9-]+$/,
            "Slug can only contain lowercase letters, numbers, and hyphens",
        ),
    description: z.string().min(1, "Description is required"),
    buyNowPrice: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z
            .number()
            .min(0, "Buy now price is required and must be a positive number"),
    ),
    minOfferPrice: z.preprocess(
        (val) =>
            val === "" || val === null || val === undefined
                ? undefined
                : Number(val),
        z
            .number()
            .min(
                0,
                "Minimum offer price is required and must be a positive number",
            ),
    ),
    isFeatured: z.boolean().default(false),
    status: z.enum(["available", "sold"]).default("available"),
    industries: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
});

export type DomainFormValues = z.infer<typeof domainFormSchema>;
