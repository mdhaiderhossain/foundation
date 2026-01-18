"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
    ArrowUpDown,
    CheckCircle,
    XCircle,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ConsultationWithDetails } from "../_hooks/use-consultations";

interface GetColumnsProps {
    onEdit: (consultation: ConsultationWithDetails) => void;
    onViewOffer: (offerId: string) => void;
}

export const getColumns = ({
    onEdit,
    onViewOffer,
}: GetColumnsProps): ColumnDef<ConsultationWithDetails>[] => [
    {
        accessorKey: "offer.domain.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Domain
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium">{row.original.offer.domain.name}</div>
        ),
    },
    {
        accessorKey: "offer.name",
        header: "Buyer",
        cell: ({ row }) => <div>{row.original.offer.name}</div>,
    },
    {
        accessorKey: "scheduled",
        header: "Scheduled",
        cell: ({ row }) =>
            row.original.scheduled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
            ),
    },
    {
        accessorKey: "completed",
        header: "Completed",
        cell: ({ row }) =>
            row.original.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
            ),
    },
    {
        accessorKey: "revenueShare",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Revenue
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = row.original.revenueShare;
            if (!amount) return <div className="text-muted-foreground">-</div>;
            return (
                <div className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(amount)}
                </div>
            );
        },
    },
    {
        id: "outcomes",
        header: "Outcomes",
        cell: ({ row }) => {
            const outcomes = [];
            if (row.original.deckWriting) outcomes.push("Deck");
            if (row.original.productBuild) outcomes.push("Build");
            if (row.original.referrals) outcomes.push("Referral");
            if (row.original.investorIntros) outcomes.push("Intro");

            if (outcomes.length === 0)
                return <span className="text-muted-foreground">-</span>;

            return (
                <div className="flex gap-1 flex-wrap">
                    {outcomes.map((outcome) => (
                        <Badge
                            key={outcome}
                            variant="secondary"
                            className="text-xs"
                        >
                            {outcome}
                        </Badge>
                    ))}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const consultation = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(consultation)}>
                            Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onViewOffer(consultation.offerId)}
                        >
                            View Offer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
