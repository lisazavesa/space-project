import axios, { AxiosInstance } from "axios";
import { CopernicusCollectionsResponse } from "../types/copernicus.types";

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
}
