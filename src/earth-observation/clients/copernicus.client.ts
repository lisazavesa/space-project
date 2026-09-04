import axios, { AxiosInstance } from "axios";
import { CopernicusCollectionsResponse, CopernicusSearchResponse } from "../types/copernicus.types";

export class CopernicusClient {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: "https://stac.dataspace.copernicus.eu/v1",
        });
    }

    async getCollections(): Promise<CopernicusCollectionsResponse> {
        const response =
            await this.client.get<CopernicusCollectionsResponse>(
                "/collections",
            );

        return response.data;
    }

    async searchItems(params: {
        bbox: [number, number, number, number];
        startDate: string;
        endDate: string;
        maxCloudCover: number;
    }): Promise<CopernicusSearchResponse> {
        const response = await this.client.post<CopernicusSearchResponse>(
            "/search",
            {
                collections: ["sentinel-2-l2a"],
                bbox: params.bbox,
                datetime: `${params.startDate}T00:00:00Z/${params.endDate}T23:59:59Z`,
                limit: 100,
                query: {
                    "eo:cloud_cover": {
                        lte: params.maxCloudCover,
                    },
                },
            },
        );

        return response.data;
    }
}
