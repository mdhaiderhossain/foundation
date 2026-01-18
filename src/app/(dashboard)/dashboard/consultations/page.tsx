import ConsultationInterface from "@/components/pages/dashboard/consultations/consultation-interface";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Consultations | Admin Dashboard",
    description: "Manage consultation tracking",
};

export default function ConsultationsPage() {
    return <ConsultationInterface />;
}
