"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type OfferWithDomain } from "../_types/offer.types";
import { useUpdateOffer } from "../_hooks/use-offer-api";
import { ConsultationDialog } from "./consultation-dialog";

const offerUpdateSchema = z.object({
    status: z.string(),
    notes: z.string().nullable(),
});

type OfferUpdateValues = z.infer<typeof offerUpdateSchema>;

interface OfferDetailDialogProps {
    offer: OfferWithDomain | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OfferDetailDialog({
    offer,
    open,
    onOpenChange,
}: OfferDetailDialogProps) {
    const updateMutation = useUpdateOffer();
    const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
        React.useState(false);

    const form = useForm<OfferUpdateValues>({
        resolver: zodResolver(offerUpdateSchema),
        values: {
            status: offer?.status ?? "new",
            notes: offer?.notes ?? "",
        },
    });

    const onSubmit = async (values: OfferUpdateValues) => {
        if (!offer) return;

        updateMutation.mutate(
            {
                id: offer.id,
                status: values.status,
                notes: values.notes ?? undefined,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            },
        );
    };

    if (!offer) return null;

    const amount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(offer.amount);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Offer Details</DialogTitle>
                    <DialogDescription>
                        View and manage offer information
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                    <div className="space-y-6 pr-4">
                        {/* Buyer Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">
                                Buyer Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="font-medium">{offer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="font-medium">{offer.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Phone
                                    </p>
                                    <p className="font-medium">
                                        {offer.phone || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Domain
                                    </p>
                                    <p className="font-medium">
                                        {offer.domain.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Offer Amount
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {amount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Created Date
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            offer.createdAt,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Consultation Tracking */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold border-b pb-2 flex-1">
                                    Consultation Tracking
                                </h3>
                            </div>
                            {offer.consultation ? (
                                <div className="space-y-3">
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge
                                            variant={
                                                offer.consultation.scheduled
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            <Calendar className="mr-1 h-3 w-3" />
                                            Scheduled:
                                            {offer.consultation.scheduled ? (
                                                <CheckCircle className="ml-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                        <Badge
                                            variant={
                                                offer.consultation.completed
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            Completed:
                                            {offer.consultation.completed ? (
                                                <CheckCircle className="ml-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                        <Badge
                                            variant={
                                                offer.consultation
                                                    .followUpDelivered
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            Follow-up:
                                            {offer.consultation
                                                .followUpDelivered ? (
                                                <CheckCircle className="ml-1 h-3 w-3" />
                                            ) : (
                                                <XCircle className="ml-1 h-3 w-3" />
                                            )}
                                        </Badge>
                                    </div>
                                    {offer.consultation.revenueShare && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Revenue Share
                                            </p>
                                            <p className="font-semibold">
                                                {new Intl.NumberFormat(
                                                    "en-US",
                                                    {
                                                        style: "currency",
                                                        currency: "USD",
                                                    },
                                                ).format(
                                                    offer.consultation
                                                        .revenueShare,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            setIsConsultationDialogOpen(true)
                                        }
                                    >
                                        Edit Consultation
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        setIsConsultationDialogOpen(true)
                                    }
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Add Consultation
                                </Button>
                            )}
                        </div>

                        <Separator />

                        {/* Offer Management Form */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">
                                Offer Management
                            </h3>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="new">
                                                                New
                                                            </SelectItem>
                                                            <SelectItem value="contacted">
                                                                Contacted
                                                            </SelectItem>
                                                            <SelectItem value="negotiating">
                                                                Negotiating
                                                            </SelectItem>
                                                            <SelectItem value="accepted">
                                                                Accepted
                                                            </SelectItem>
                                                            <SelectItem value="closed">
                                                                Closed
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
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Internal Notes
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Add notes about this offer..."
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
                                    <div className="flex justify-end gap-3 pt-4 font-semibold">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => onOpenChange(false)}
                                            disabled={updateMutation.isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={updateMutation.isPending}
                                        >
                                            {updateMutation.isPending
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>

            <ConsultationDialog
                offer={offer}
                consultation={offer.consultation || null}
                open={isConsultationDialogOpen}
                onOpenChange={setIsConsultationDialogOpen}
            />
        </Dialog>
    );
}
