"use client";
import { signOut } from "@/app/actions/auth.action";

export default function Dashboard() {
    return (
        <>
            <button onClick={() => signOut()}>Sign out</button>
        </>
    );
}
