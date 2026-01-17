"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

interface Prop {
    children?: Readonly<React.ReactNode>;
    afterLoadingName?: string;
}

export default function SubmitButton({
    children = "Submit",
    afterLoadingName = "Submitting...",
}: Prop) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" aria-disabled={pending}>
            {pending ? afterLoadingName : children}
        </Button>
    );
}
