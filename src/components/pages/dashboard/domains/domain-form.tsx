"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    domainFormSchema,
    type DomainFormValues,
} from "@/schemas/domain.schema";
import { type Domain } from "./_types/domain.types";
import { useCreateDomain, useUpdateDomain } from "./_hooks/use-domain-api";

export function DomainForm({
    initialData,
    onCancel,
    onSave,
}: {
    initialData?: Domain;
    onCancel: () => void;
    onSave: () => void;
}) {
    const createDomainMutation = useCreateDomain();
    const updateDomainMutation = useUpdateDomain();
    const isPending =
        createDomainMutation.isPending || updateDomainMutation.isPending;

    const form = useForm<z.infer<typeof domainFormSchema>>({
        resolver: zodResolver(domainFormSchema) as any,
        defaultValues: {
            name: initialData?.name ?? "",
            slug: initialData?.slug ?? "",
            description: initialData?.description ?? "",
            buyNowPrice: initialData?.buyNowPrice ?? (undefined as any),
            minOfferPrice: initialData?.minOfferPrice ?? (undefined as any),
            isFeatured: initialData?.isFeatured ?? false,
            status: (initialData?.status as any) ?? "available",
            industries: initialData?.industries ?? [],
            keywords: initialData?.keywords ?? [],
        },
    });

    const onSubmit = async (values: DomainFormValues) => {
        if (initialData) {
            updateDomainMutation.mutate(
                { id: initialData.id, values },
                {
                    onSuccess: () => onSave(),
                },
            );
        } else {
            createDomainMutation.mutate(values, {
                onSuccess: () => onSave(),
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">
                        Basic Information
                    </h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Domain Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="example"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the domain..."
                                            className="min-h-[100px]"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">
                        Pricing
                    </h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="buyNowPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Buy Now Price ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minOfferPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Minimum Offer Price ($)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Meta & Settings */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">
                        Meta & Settings
                    </h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="industries"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Industries</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tech, SaaS, AI (Comma separated)"
                                            value={(field.value || []).join(
                                                ", ",
                                            )}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                field.onChange(
                                                    val
                                                        ? val
                                                              .split(",")
                                                              .map((i) =>
                                                                  i.trim(),
                                                              )
                                                        : [],
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keywords</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="modern, fast, unique (Comma separated)"
                                            value={(field.value || []).join(
                                                ", ",
                                            )}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                field.onChange(
                                                    val
                                                        ? val
                                                              .split(",")
                                                              .map((k) =>
                                                                  k.trim(),
                                                              )
                                                        : [],
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">
                                                    Available
                                                </SelectItem>
                                                <SelectItem value="sold">
                                                    Sold
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Featured</FormLabel>
                                        <FormDescription>
                                            Show in featured section
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 font-semibold">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
