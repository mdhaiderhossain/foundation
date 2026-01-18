"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRecentSales } from "../_hooks/use-dashboard-api";
import { Loader } from "lucide-react";

export function RecentSales() {
    const { data: sales = [], isLoading } = useRecentSales();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
                {sales.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Buyer</TableHead>
                                <TableHead>Domain</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.map((sale: any) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">
                                        {sale.name}
                                    </TableCell>
                                    <TableCell>
                                        {sale.domain?.name || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(sale.amount)}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(sale.createdAt),
                                            "MMM dd, yyyy",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className="capitalize"
                                        >
                                            {sale.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No closed sales yet
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
