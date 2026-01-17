"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormDescription,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { signUp } from "@/app/actions/auth.action";
import { singupFormSchema } from "@/schemas/auth.schema";
import { useState } from "react";

export default function SignupForm({
    ...props
}: React.ComponentProps<typeof Card>) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof singupFormSchema>>({
        resolver: zodResolver(singupFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof singupFormSchema>) {
        try {
            setIsLoading(true);
            await signUp(values);

            toast.success("Account created successfully", {
                richColors: true,
            });

            form.reset();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    richColors: true,
                });
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle className="text-2xl">Admin</CardTitle>
                <CardDescription>Create an admin account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="hello@admin.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        {!form.formState.errors.password && (
                                            <FormDescription>
                                                Must be at least 8 characters
                                                long.
                                            </FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FieldGroup>
                                <Field>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        aria-disabled={isLoading}
                                    >
                                        {isLoading
                                            ? "Creating..."
                                            : "Create Account"}
                                    </Button>
                                    <FieldDescription className="px-6 text-center">
                                        Already have an account?{" "}
                                        <Link href="/login">Login</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
