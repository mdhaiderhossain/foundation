"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useConsultations } from "./_hooks/use-consultations";
import { useConsultationTable } from "./_hooks/use-consultation-table";
import { getColumns } from "./_components/consultation-columns";
import { ConsultationTable } from "./_components/consultation-table";
import { ConsultationDialog } from "../offers/_components/consultation-dialog";
import type { ConsultationWithDetails } from "./_hooks/use-consultations";
import { OfferWithDomain } from "../offers/_types/offer.types";

export default function ConsultationInterface() {
    const router = useRouter();
    const { data: consultations = [], isLoading } = useConsultations();
    const [selectedConsultation, setSelectedConsultation] =
        React.useState<ConsultationWithDetails | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleEdit = React.useCallback(
        (consultation: ConsultationWithDetails) => {
            setSelectedConsultation(consultation);
            setIsDialogOpen(true);
        },
        [],
    );

    const handleViewOffer = React.useCallback(
        (offerId: string) => {
            router.push(`/dashboard/offers`);
        },
        [router],
    );

    const columns = React.useMemo(
        () => getColumns({ onEdit: handleEdit, onViewOffer: handleViewOffer }),
        [handleEdit, handleViewOffer],
    );

    const { table } = useConsultationTable({ data: consultations, columns });

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-5rem)] grid place-items-center">
                <div className="text-muted-foreground animate-pulse text-lg">
                    <Loader className="animate-spin" />
                </div>
            </div>
        );
    }
    const selectedOffer = selectedConsultation
        ? ({
              ...selectedConsultation.offer,
          } as unknown as OfferWithDomain)
        : null;

    return (
        <div className="space-y-4 w-full xl:w-10/12 2xl:w-8/12 mx-auto">
            <div className="pt-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    Consultations
                </h1>
                <p className="text-muted-foreground">
                    Track and manage all consultation activities and downstream
                    outcomes.
                </p>
            </div>

            <ConsultationTable table={table} columnsCount={columns.length} />

            {selectedConsultation && selectedOffer && (
                <ConsultationDialog
                    offer={selectedOffer}
                    consultation={selectedConsultation}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </div>
    );
}
