"use client";

import React from "react";
import {
    Plus,
    Pencil,
    Trash2,
    FileText,
    Lightbulb,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Domain } from "../_types/domain.types";

interface DomainDetailsProps {
    domain: Domain;
}

export function DomainDetails({ domain }: DomainDetailsProps) {
    return (
        <Tabs defaultValue="ideas">
            <TabsList>
                <TabsTrigger value="ideas">
                    <Lightbulb className="mr-2 h-4 w-4" /> Ideas
                </TabsTrigger>
                <TabsTrigger value="reports">
                    <FileText className="mr-2 h-4 w-4" /> Reports
                </TabsTrigger>
                <TabsTrigger value="packages">
                    <Package className="mr-2 h-4 w-4" /> Packages
                </TabsTrigger>
                {/* <TabsTrigger value="offers">
                    <Plus className="mr-2 h-4 w-4" /> Offers
                </TabsTrigger> */}
            </TabsList>

            <TabsContent value="ideas" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Business Ideas</h3>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Idea
                    </Button>
                </div>
                {domain.ideas && domain.ideas.length > 0 ? (
                    domain.ideas.map((idea) => (
                        <Card key={idea.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-bold">
                                    {idea.title}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {idea.preview}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        No ideas yet.
                    </div>
                )}
            </TabsContent>

            <TabsContent value="reports" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Domain Reports</h3>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Upload Report
                    </Button>
                </div>
                {domain.reports && domain.reports.length > 0 ? (
                    domain.reports.map((report) => (
                        <Card key={report.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <CardTitle className="text-base font-bold">
                                        {report.title}
                                    </CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {report.previewText}
                                </p>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-xs"
                                >
                                    {report.fileUrl}
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        No reports yet.
                    </div>
                )}
            </TabsContent>

            <TabsContent value="packages" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Branding Packages</h3>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Package
                    </Button>
                </div>
                {domain.brandingPackages &&
                domain.brandingPackages.length > 0 ? (
                    domain.brandingPackages.map((pkg) => (
                        <Card key={pkg.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-bold">
                                    {pkg.title} - ${pkg.price}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {pkg.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                        No packages yet.
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
}
