"use client";

import * as React from "react";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { type OfferWithDomain } from "../_types/offer.types";

interface UseOfferTableProps {
    data: OfferWithDomain[];
    columns: ColumnDef<OfferWithDomain>[];
}

export function useOfferTable({ data, columns }: UseOfferTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return { table };
}
