"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Domain } from "../_types/domain.types";
import { format } from "date-fns";

interface GetColumnsProps {
    onEdit: (domain: Domain) => void;
    onView: (domain: Domain) => void;
    onDelete: (domain: Domain) => void;
}

export const getColumns = ({
    onEdit,
    onView,
    onDelete,
}: GetColumnsProps): ColumnDef<Domain>[] => [
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
                Domain Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "buyNowPrice",
        header: "Buy Now Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("buyNowPrice"));
            const formatted = isNaN(amount)
                ? "N/A"
                : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                  }).format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "minOfferPrice",
        header: "Min Offer Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("minOfferPrice"));
            const formatted = isNaN(amount)
                ? "N/A"
                : new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                  }).format(amount);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    className="capitalize"
                    variant={status === "available" ? "default" : "secondary"}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => (row.getValue("isFeatured") ? "Yes" : "No"),
    },
    {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as string;
            return <div> {format(new Date(date), "PPP")}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const domain = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(domain)}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(domain)}
                        title="View Details"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(domain)}
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
