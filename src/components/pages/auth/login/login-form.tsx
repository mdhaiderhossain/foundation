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
import { signIn } from "@/app/actions/auth.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginFormSchema } from "@/schemas/auth.schema";

export default function LoginForm({
    ...props
}: React.ComponentProps<typeof Card>) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        try {
            setIsLoading(true);

            await signIn(values);

            toast.success("Login successful", {
                richColors: true,
            });

            form.reset();

            router.push("/dashboard");
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
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Login to your admin account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
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
                            <FieldGroup>
                                <Field>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        aria-disabled={isLoading}
                                    >
                                        {isLoading ? "Logging in..." : "Login"}
                                    </Button>
                                    <FieldDescription className="px-6 text-center">
                                        Don&apos;t have an account?{" "}
                                        <Link href="/signup">Sign up</Link>
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
