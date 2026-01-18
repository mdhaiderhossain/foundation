import { type Consultation } from "@/components/pages/dashboard/domains/_types/domain.types";

export type OfferWithDomain = {
    id: string;
    domainId: string;
    name: string;
    email: string;
    phone: string | null;
    amount: number;
    status: string;
    notes: string | null;
    createdAt: Date | string;
    domain: {
        id: string;
        name: string;
        slug: string;
    };
    consultation?: Consultation | null;
};
