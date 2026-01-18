"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    useCreateConsultation,
    useUpdateConsultation,
} from "../_hooks/use-consultation-api";
import type { OfferWithDomain } from "../_types/offer.types";
import type { Consultation } from "@/components/pages/dashboard/domains/_types/domain.types";

const consultationSchema = z.object({
    scheduled: z.boolean(),
    completed: z.boolean(),
    followUpDelivered: z.boolean(),
    notes: z.string().nullable(),
    deckWriting: z.boolean(),
    productBuild: z.boolean(),
    referrals: z.boolean(),
    investorIntros: z.boolean(),
    revenueShare: z.number().nullable(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

interface ConsultationDialogProps {
    offer: OfferWithDomain | null;
    consultation: Consultation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ConsultationDialog({
    offer,
    consultation,
    open,
    onOpenChange,
}: ConsultationDialogProps) {
    const createMutation = useCreateConsultation();
    const updateMutation = useUpdateConsultation();

    const form = useForm<ConsultationFormValues>({
        resolver: zodResolver(consultationSchema),
        values: consultation
            ? {
                  scheduled: consultation.scheduled,
                  completed: consultation.completed,
                  followUpDelivered: consultation.followUpDelivered,
                  notes: consultation.notes,
                  deckWriting: consultation.deckWriting,
                  productBuild: consultation.productBuild,
                  referrals: consultation.referrals,
                  investorIntros: consultation.investorIntros,
                  revenueShare: consultation.revenueShare,
              }
            : {
                  scheduled: false,
                  completed: false,
                  followUpDelivered: false,
                  notes: "",
                  deckWriting: false,
                  productBuild: false,
                  referrals: false,
                  investorIntros: false,
                  revenueShare: null,
              },
    });

    const onSubmit = async (values: ConsultationFormValues) => {
        if (!offer) return;

        if (consultation) {
            updateMutation.mutate(
                {
                    id: consultation.id,
                    data: values,
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                },
            );
        } else {
            createMutation.mutate(
                {
                    offerId: offer.id,
                    ...values,
                },
                {
                    onSuccess: () => {
                        onOpenChange(false);
                    },
                },
            );
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    if (!offer) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Consultation Tracking - {offer.name}
                    </DialogTitle>
                    <DialogDescription>
                        Track consultation status and downstream opportunities
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                    <div className="space-y-6 pr-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Consultation Status */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">
                                        Consultation Status
                                    </h3>
                                    <FormField
                                        control={form.control}
                                        name="scheduled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Scheduled
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="completed"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Completed
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="followUpDelivered"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Follow-up Delivered
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Additional Outcomes */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">
                                        Additional Outcomes
                                    </h3>
                                    <FormField
                                        control={form.control}
                                        name="deckWriting"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Deck Writing
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="productBuild"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Product / AI Build
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="referrals"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Referrals
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="investorIntros"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                <div className="space-y-0.5">
                                                    <FormLabel>
                                                        Investor Introductions
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Revenue & Notes */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">
                                        Revenue & Notes
                                    </h3>
                                    <FormField
                                        control={form.control}
                                        name="revenueShare"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Revenue Share / Back-end
                                                    Profit ($)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        value={
                                                            field.value ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                                    ? parseFloat(
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      )
                                                                    : null,
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Consultation Notes
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Track consultation details, outcomes, and next steps..."
                                                        className="min-h-[120px]"
                                                        {...field}
                                                        value={
                                                            field.value ?? ""
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 font-semibold">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending
                                            ? "Saving..."
                                            : consultation
                                              ? "Update Consultation"
                                              : "Create Consultation"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
