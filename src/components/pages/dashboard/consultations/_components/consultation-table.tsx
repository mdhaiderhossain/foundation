"use client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { flexRender, type Table as TableType } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type ConsultationWithDetails } from "../_hooks/use-consultations";
import { Card } from "@/components/ui/card";

interface ConsultationTableProps {
    table: TableType<ConsultationWithDetails>;
    columnsCount: number;
}

export function ConsultationTable({
    table,
    columnsCount,
}: ConsultationTableProps) {
    return (
        <Card className="bg-sidebar-primary-foreground/40">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="hover:bg-transparent"
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="px-4">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-accent/30"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-4">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columnsCount}
                                className="h-24 text-center"
                            >
                                No consultations found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => table.previousPage()}
                            className={
                                !table.getCanPreviousPage()
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                    {(() => {
                        const pageIndex = table.getState().pagination.pageIndex;
                        const pageCount = table.getPageCount();
                        const windowSize = 2;

                        const renderLink = (page: number) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => table.setPageIndex(page)}
                                    isActive={pageIndex === page}
                                    className="cursor-pointer"
                                >
                                    {page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        );

                        const renderEllipsis = (key: string) => (
                            <PaginationItem key={key}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );

                        const items = [];

                        if (pageCount > 0) {
                            items.push(renderLink(0));
                        }

                        if (pageIndex > windowSize + 1) {
                            items.push(renderEllipsis("start-ellipsis"));
                        }

                        const start = Math.max(1, pageIndex - windowSize);
                        const end = Math.min(
                            pageCount - 2,
                            pageIndex + windowSize,
                        );

                        for (let i = start; i <= end; i++) {
                            items.push(renderLink(i));
                        }

                        if (pageIndex < pageCount - windowSize - 2) {
                            items.push(renderEllipsis("end-ellipsis"));
                        }

                        if (pageCount > 1) {
                            items.push(renderLink(pageCount - 1));
                        }

                        return items;
                    })()}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => table.nextPage()}
                            className={
                                !table.getCanNextPage()
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </Card>
    );
}
