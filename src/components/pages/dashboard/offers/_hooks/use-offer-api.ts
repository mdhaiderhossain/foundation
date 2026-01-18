"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type OfferWithDomain } from "../_types/offer.types";

const API_BASE_URL = "/api/admin/offers";

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "An error occurred" }));
        throw new Error(error.message || "An error occurred");
    }
    return response.json();
}

export function useOffers() {
    return useQuery({
        queryKey: ["offers"],
        queryFn: async () => {
            const response = await fetch(API_BASE_URL, { cache: "no-store" });
            return handleResponse(response) as Promise<OfferWithDomain[]>;
        },
    });
}

export function useUpdateOffer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            status,
            notes,
        }: {
            id: string;
            status?: string;
            notes?: string;
        }) => {
            const response = await fetch(API_BASE_URL, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status, notes }),
            });
            return handleResponse(response);
        },
        onMutate: async ({ id, status, notes }) => {
            await queryClient.cancelQueries({ queryKey: ["offers"] });

            const previousOffers = queryClient.getQueryData<OfferWithDomain[]>([
                "offers",
            ]);

            if (previousOffers) {
                queryClient.setQueryData<OfferWithDomain[]>(
                    ["offers"],
                    previousOffers.map((o) =>
                        o.id === id
                            ? {
                                  ...o,
                                  ...(status !== undefined && { status }),
                                  ...(notes !== undefined && { notes }),
                              }
                            : o,
                    ),
                );
            }

            return { previousOffers };
        },
        onError: (err, variables, context) => {
            if (context?.previousOffers) {
                queryClient.setQueryData(["offers"], context.previousOffers);
            }
            toast.error("Failed to update offer");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast.success("Offer updated successfully");
        },
    });
}
