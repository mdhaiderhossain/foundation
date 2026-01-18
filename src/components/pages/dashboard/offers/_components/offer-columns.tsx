"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type OfferWithDomain } from "../_types/offer.types";
import { format } from "date-fns";

interface GetColumnsProps {
    onView: (offer: OfferWithDomain) => void;
}

export const getColumns = ({
    onView,
}: GetColumnsProps): ColumnDef<OfferWithDomain>[] => [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="-ml-4"
            >
                Buyer Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
        accessorKey: "domain",
        header: "Domain Name",
        cell: ({ row }) => {
            const domain = row.getValue("domain") as { name: string };
            return <div className="font-medium">{domain.name}</div>;
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="-ml-4"
            >
                Offer Amount <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="font-semibold">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusVariants: Record<
                string,
                "default" | "secondary" | "destructive" | "outline"
            > = {
                new: "default",
                contacted: "secondary",
                negotiating: "outline",
                accepted: "default",
                closed: "secondary",
            };
            return (
                <Badge
                    className="capitalize"
                    variant={statusVariants[status.toLowerCase()] || "default"}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="-ml-4"
            >
                Created Date <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as string;
            return <div>{format(new Date(date), "PPP")}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const offer = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(offer)}
                        title="View/Edit Offer"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
