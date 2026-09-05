import axios, { AxiosInstance } from "axios";
import {
    CopernicusCollectionsResponse,
    CopernicusSearchResponse,
} from "../types/copernicus.types";
import { BadGatewayException } from "@nestjs/common";
import {
    COPERNICUS_BASE_URL,
    COPERNICUS_TIMEOUT,
    SENTINEL_2_L2A_COLLECTION,
} from "../constants/copernicus.constants";

export class CopernicusClient {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: COPERNICUS_BASE_URL,
            timeout: COPERNICUS_TIMEOUT,
        });
    }

    async getCollections(): Promise<CopernicusCollectionsResponse> {
        return this.handleRequest(async () => {
            const response =
                await this.client.get<CopernicusCollectionsResponse>(
                    "/collections",
                );

            return response.data;
        });
    }

    async searchItems(params: {
        bbox: [number, number, number, number];
        startDate: string;
        endDate: string;
        maxCloudCover: number;
    }): Promise<CopernicusSearchResponse> {
        return this.handleRequest(async () => {
            const response = await this.client.post<CopernicusSearchResponse>(
                "/search",
                {
                    collections: [SENTINEL_2_L2A_COLLECTION],
                    bbox: params.bbox,
                    datetime:
                        `${params.startDate}T00:00:00Z/` +
                        `${params.endDate}T23:59:59Z`,
                    limit: 100,
                    query: {
                        "eo:cloud_cover": {
                            lte: params.maxCloudCover,
                        },
                    },
                },
            );

            return response.data;
        });
    }

    private async handleRequest<T>(request: () => Promise<T>): Promise<T> {
        try {
            return await request();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new BadGatewayException({
                    message: "Failed to fetch data from Copernicus API",
                    externalStatus: error.response?.status ?? null,
                });
            }

            throw error;
        }
    }
}
