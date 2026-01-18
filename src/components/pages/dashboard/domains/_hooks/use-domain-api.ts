"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type DomainFormValues } from "@/schemas/domain.schema";
import { type Domain } from "../_types/domain.types";

const API_BASE_URL = "/api/admin/domains";

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: "An error occurred" }));
        throw new Error(error.message || "An error occurred");
    }
    return response.json();
}

export function useDomains() {
    return useQuery({
        queryKey: ["domains"],
        queryFn: async () => {
            const response = await fetch(API_BASE_URL, { cache: "no-store" });
            return handleResponse(response) as Promise<Domain[]>;
        },
    });
}

export function useDomain(slug: string) {
    return useQuery({
        queryKey: ["domains", slug],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/${slug}`, {
                cache: "no-store",
            });
            return handleResponse(response) as Promise<Domain>;
        },
        enabled: !!slug,
    });
}

export function useCreateDomain() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: DomainFormValues) => {
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            return handleResponse(response);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["domains"] });
            toast.success("Domain created successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create domain");
        },
    });
}

export function useUpdateDomain() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            values,
        }: {
            id: string;
            values: Partial<DomainFormValues>;
        }) => {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            return handleResponse(response);
        },
        onMutate: async ({ id, values }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["domains"] });
            await queryClient.cancelQueries({ queryKey: ["domains", id] });

            // Snapshot the previous value
            const previousDomains = queryClient.getQueryData<Domain[]>([
                "domains",
            ]);
            const previousDomain = queryClient.getQueryData<Domain>([
                "domains",
                id,
            ]);

            // Optimistically update to the new value
            if (previousDomains) {
                queryClient.setQueryData<Domain[]>(
                    ["domains"],
                    previousDomains.map((d) =>
                        d.id === id ? { ...d, ...values } : d,
                    ),
                );
            }
            if (previousDomain) {
                queryClient.setQueryData<Domain>(["domains", id], {
                    ...previousDomain,
                    ...values,
                });
            }

            // Return a context object with the snapshotted value
            return { previousDomains, previousDomain };
        },
        onError: (err, { id }, context) => {
            // Rollback on error
            if (context?.previousDomains) {
                queryClient.setQueryData(["domains"], context.previousDomains);
            }
            if (context?.previousDomain) {
                queryClient.setQueryData(
                    ["domains", id],
                    context.previousDomain,
                );
            }
            toast.error("Failed to update domain");
        },
        onSettled: (data, error, { id }) => {
            // Always refetch after error or success to ensure we are in sync
            queryClient.invalidateQueries({ queryKey: ["domains"] });
            queryClient.invalidateQueries({ queryKey: ["domains", id] });
            if (!error) {
                toast.success("Domain updated successfully");
            }
        },
    });
}

export function useDeleteDomain() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE",
            });
            return handleResponse(response);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["domains"] });

            const previousDomains = queryClient.getQueryData<Domain[]>([
                "domains",
            ]);

            if (previousDomains) {
                queryClient.setQueryData<Domain[]>(
                    ["domains"],
                    previousDomains.filter((d) => d.id !== id),
                );
            }

            return { previousDomains };
        },
        onError: (err, id, context) => {
            if (context?.previousDomains) {
                queryClient.setQueryData(["domains"], context.previousDomains);
            }
            toast.error("Failed to delete domain");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["domains"] });
            toast.success("Domain deleted successfully");
        },
    });
}
