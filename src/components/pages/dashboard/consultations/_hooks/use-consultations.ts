"use client";

import { useQuery } from "@tanstack/react-query";
import type { Consultation } from "../../domains/_types/domain.types";
import type { Offer } from "../../domains/_types/domain.types";
import type { Domain } from "../../domains/_types/domain.types";

export type ConsultationWithDetails = Consultation & {
    offer: Offer & {
        domain: Domain;
    };
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

export function useConsultations() {
    return useQuery({
        queryKey: ["consultations"],
        queryFn: async () => {
            const response = await fetch("/api/admin/consultations");
            return handleResponse(response) as Promise<
                ConsultationWithDetails[]
            >;
        },
    });
}
