"use client";
import { signOut } from "@/app/actions/auth";

export default async function Dashboard() {
    return (
        <>
            <button onClick={() => signOut()}>Sign out</button>
        </>
    );
}
