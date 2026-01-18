export type DomainIdea = {
    id: string;
    domainId: string;
    title: string;
    preview: string;
    content: string;
};

export type Report = {
    id: string;
    domainId: string;
    title: string;
    fileUrl: string;
    previewText: string | null;
};

export type BrandingPackage = {
    id: string;
    domainId: string;
    title: string;
    content: string;
    price: number;
};

export type Consultation = {
    id: string;
    offerId: string;
    scheduled: boolean;
    completed: boolean;
    followUpDelivered: boolean;
    notes: string | null;
    deckWriting: boolean;
    productBuild: boolean;
    referrals: boolean;
    investorIntros: boolean;
    revenueShare: number | null;
};

export type Offer = {
    id: string;
    domainId: string;
    name: string;
    email: string;
    phone: string | null;
    amount: number;
    status: string;
    notes: string | null;
    createdAt: Date | string;
    consultation?: Consultation | null;
};

export type Domain = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    buyNowPrice: number | null;
    minOfferPrice: number | null;
    status: "available" | "sold";
    isFeatured: boolean;
    industries: string[];
    keywords: string[];
    createdAt: Date | string;
    updatedAt?: Date | string;
    // For list view (with counts)
    _count?: {
        ideas: number;
        reports: number;
        brandingPackages: number;
        offers: number;
    };
    // For detail view (with full data)
    ideas?: DomainIdea[];
    reports?: Report[];
    brandingPackages?: BrandingPackage[];
    offers?: Offer[];
};
