"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type ConsultationData = {
    offerId: string;
    scheduled: boolean;
    completed: boolean;
    followUpDelivered: boolean;
    notes: string | null;
    deckWriting: boolean;
    productBuild: boolean;
    referrals: boolean;
    investorIntros: boolean;
    revenueShare: number | null;
};

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "An error occurred" }));
        throw new Error(error.message || "An error occurred");
    }
    return response.json();
}

export function useCreateConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<ConsultationData>) => {
            const response = await fetch("/api/admin/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast.success("Consultation created successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create consultation");
        },
    });
}

export function useUpdateConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<ConsultationData>;
        }) => {
            const response = await fetch(`/api/admin/consultations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast.success("Consultation updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update consultation");
        },
    });
}
