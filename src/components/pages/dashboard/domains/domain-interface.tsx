"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

import { DomainForm } from "./domain-form";
import { DomainDetails } from "./_components/domain-details";
import { DomainTable } from "./_components/domain-table";
import { getColumns } from "./_components/domain-columns";
import { useDomainTable } from "./_hooks/use-domain-table";
import { useDomains, useDeleteDomain } from "./_hooks/use-domain-api";
import { type Domain } from "./_types/domain.types";

export default function DomainInterface() {
    const router = useRouter();
    const { data: domains = [], isLoading } = useDomains();
    const deleteMutation = useDeleteDomain();

    const [selectedDomain, setSelectedDomain] = React.useState<Domain | null>(
        null,
    );
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [domainToDelete, setDomainToDelete] = React.useState<Domain | null>(
        null,
    );

    const handleEdit = React.useCallback((domain: Domain) => {
        setSelectedDomain(domain);
        setIsEditDialogOpen(true);
    }, []);

    const handleView = React.useCallback(
        (domain: Domain) => {
            router.push(`/dashboard/domains/${domain.slug}`);
        },
        [router],
    );

    const handleDelete = React.useCallback((domain: Domain) => {
        setDomainToDelete(domain);
        setIsDeleteDialogOpen(true);
    }, []);

    const confirmDelete = React.useCallback(() => {
        if (domainToDelete) {
            deleteMutation.mutate(domainToDelete.id);
            setIsDeleteDialogOpen(false);
            setDomainToDelete(null);
        }
    }, [domainToDelete, deleteMutation]);

    const columns = React.useMemo(
        () =>
            getColumns({
                onEdit: handleEdit,
                onView: handleView,
                onDelete: handleDelete,
            }),
        [handleEdit, handleView, handleDelete],
    );

    const { table } = useDomainTable({ data: domains, columns });

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
        <div className="space-y-4  w-full xl:w-10/12 2xl:w-8/12 mx-auto">
            <div className="flex md:flex-row flex-col md:items-center md:justify-between pt-4 gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Domains
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your domains here.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog
                        open={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button>Add</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Domain</DialogTitle>
                                <DialogDescription>
                                    Fill in the details below to add a new
                                    domain to your inventory.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[80vh]">
                                <div className="pr-4 py-4">
                                    <DomainForm
                                        onCancel={() =>
                                            setIsAddDialogOpen(false)
                                        }
                                        onSave={() => setIsAddDialogOpen(false)}
                                    />
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                    <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                    >
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    Edit Domain: {selectedDomain?.name}
                                </DialogTitle>
                                <DialogDescription>
                                    Make changes to the domain details below.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[80vh] pr-4">
                                {selectedDomain && (
                                    <div className="space-y-6">
                                        <DomainForm
                                            initialData={selectedDomain}
                                            onCancel={() =>
                                                setIsEditDialogOpen(false)
                                            }
                                            onSave={() =>
                                                setIsEditDialogOpen(false)
                                            }
                                        />
                                        <Separator />
                                        <div className="pb-4">
                                            <h3 className="mb-4 text-lg font-medium">
                                                Domain Management
                                            </h3>
                                            <DomainDetails
                                                domain={selectedDomain}
                                            />
                                        </div>
                                    </div>
                                )}
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <DomainTable table={table} columnsCount={columns.length} />

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex justify-center">
                            <CircleAlert
                                className="text-destructive"
                                size={50}
                            />
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            <h4 className="text-black text-2xl font-semibold">
                                Are you sure you want to delete this domain?
                            </h4>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDomainToDelete(null)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export * from "./_types/domain.types";
