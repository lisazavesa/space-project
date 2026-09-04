export interface CopernicusCollection {
    id: string;
    title?: string;
    description?: string;
}

export interface CopernicusCollectionsResponse {
    collections: CopernicusCollection[];
}
