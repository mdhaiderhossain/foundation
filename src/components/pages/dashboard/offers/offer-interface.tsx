"use client";

import * as React from "react";
import { Loader } from "lucide-react";
import { getColumns } from "./_components/offer-columns";
import { OfferTable } from "./_components/offer-table";
import { OfferDetailDialog } from "./_components/offer-detail-dialog";
import { useOfferTable } from "./_hooks/use-offer-table";
import { useOffers } from "./_hooks/use-offer-api";
import { type OfferWithDomain } from "./_types/offer.types";

export default function OfferInterface() {
    const { data: offers = [], isLoading } = useOffers();
    const [selectedOffer, setSelectedOffer] =
        React.useState<OfferWithDomain | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);

    const handleView = React.useCallback((offer: OfferWithDomain) => {
        setSelectedOffer(offer);
        setIsDetailDialogOpen(true);
    }, []);

    const columns = React.useMemo(
        () =>
            getColumns({
                onView: handleView,
            }),
        [handleView],
    );

    const { table } = useOfferTable({ data: offers, columns });

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-5rem)] grid place-items-center">
                <div className="text-muted-foreground animate-pulse text-lg">
                    <Loader className="animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full xl:w-10/12 2xl:w-8/12 mx-auto">
            <div className="flex md:flex-row flex-col md:items-center md:justify-between pt-4 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Offers & Leads
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage all domain offers and leads.
                    </p>
                </div>
            </div>

            <OfferTable table={table} columnsCount={columns.length} />

            <OfferDetailDialog
                offer={selectedOffer}
                open={isDetailDialogOpen}
                onOpenChange={setIsDetailDialogOpen}
            />
        </div>
    );
}

export * from "./_types/offer.types";
