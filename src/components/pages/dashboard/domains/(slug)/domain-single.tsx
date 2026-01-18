"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Settings,
    Trash,
    Calendar,
    Hash,
    Activity,
    Loader,
    Globe,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { DomainDetails } from "@/components/pages/dashboard/domains/_components/domain-details";
import { DomainForm } from "@/components/pages/dashboard/domains/domain-form";

import {
    useDomain,
    useDeleteDomain,
} from "@/components/pages/dashboard/domains/_hooks/use-domain-api";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DomainSingle() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { data: domain, isLoading, error } = useDomain(slug);
    const deleteMutation = useDeleteDomain();

    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !domain) {
        return (
            <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4">
                <p className="text-xl font-semibold text-destructive">
                    Domain not found
                </p>
                <Button onClick={() => router.push("/dashboard/domains")}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12 w-full xl:w-10/12 2xl:w-8/12 mx-auto">
            <header>
                <div className="px-4 py-4 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Globe size={24} />
                            <h1 className="text-2xl font-bold tracking-tight">
                                {domain.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            Delete
                        </Button>
                        <Button onClick={() => setIsEditDialogOpen(true)}>
                            Edit
                        </Button>
                    </div>
                </div>
            </header>

            <main className="px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Domain Details
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Key information and positioning insights
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-400 block mb-2">
                                            Description
                                        </label>
                                        <p className="text-gray-700 leading-relaxed">
                                            {domain.description}
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-gray-50 rounded-xl p-4 border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Hash className="h-4 w-4 text-gray-400" />
                                                <span className="text-xs font-bold uppercase text-gray-400">
                                                    Slug
                                                </span>
                                            </div>
                                            <p className="font-mono text-sm">
                                                /{domain.slug}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-xs font-bold uppercase text-gray-400">
                                                    Created Date
                                                </span>
                                            </div>
                                            <p className="text-sm">
                                                {domain.createdAt
                                                    ? format(
                                                          new Date(
                                                              domain.createdAt,
                                                          ),
                                                          "PPP",
                                                      )
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-xs font-bold uppercase text-gray-400 block mb-3">
                                                Industries
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {domain.industries.map((i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                    >
                                                        {i}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase text-gray-400 block mb-3">
                                                Keywords
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {domain.keywords.map((k) => (
                                                    <Badge
                                                        key={k}
                                                        variant="outline"
                                                    >
                                                        {k}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <DomainDetails domain={domain} />
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold">
                                    Pricing & Status
                                </h2>
                                <Badge
                                    variant={
                                        domain.status === "available"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    <span className="flex items-center gap-1.5 capitalize">
                                        {domain.status}
                                    </span>
                                </Badge>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">
                                        Buy Now Price
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold">
                                            $
                                            {domain.buyNowPrice?.toLocaleString() ??
                                                "N/A"}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            USD
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                        <Activity className="h-3 w-3" />
                                        Instant purchase enabled
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">
                                        Minimum Offer
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold">
                                            $
                                            {domain.minOfferPrice?.toLocaleString() ??
                                                "N/A"}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            USD
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                                        <Activity className="h-3 w-3" />
                                        Offer
                                    </p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Featured Listing
                                    </span>
                                    <Badge>
                                        {domain.isFeatured ? "Yes" : "No"}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {/* EDIT */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Domain: {domain.name}</DialogTitle>
                        <DialogDescription>
                            Update domain information
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[80vh]">
                        <div className="pr-4 py-4">
                            <DomainForm
                                initialData={domain}
                                onCancel={() => setIsEditDialogOpen(false)}
                                onSave={() => setIsEditDialogOpen(false)}
                            />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* DELETE */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete domain?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                deleteMutation.mutate(domain.id, {
                                    onSuccess: () =>
                                        router.push("/dashboard/domains"),
                                })
                            }
                            className="bg-destructive"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
