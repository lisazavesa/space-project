export interface CopernicusCollection {
    id: string;
    title?: string;
    description?: string;
}

export interface CopernicusStacItem {
    id: string;
    geometry: GeoJSON.Geometry;
    bbox?: number[];
    properties: {
        datetime: string;
        "eo:cloud_cover"?: number;
    };
}

export interface CopernicusCollectionsResponse {
    collections: CopernicusCollection[];
}

export interface CopernicusSearchResponse {
    type: "FeatureCollection";
    features: CopernicusStacItem[];
}
