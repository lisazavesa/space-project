import axios, { AxiosInstance } from "axios";
import {
    CopernicusCollectionsResponse,
    CopernicusSearchResponse,
} from "../types/copernicus.types";
import {
    BadGatewayException,
    BadRequestException,
    Injectable,
} from "@nestjs/common";
import {
    COPERNICUS_BASE_URL,
    COPERNICUS_TIMEOUT,
    SENTINEL_2_L2A_COLLECTION,
} from "../constants/copernicus.constants";
import { SentinelHubAuthService } from "../services/sentinel-hub-auth.service";
import { NdviResponseDto } from "../dto/ndvi-statistics.dto";

@Injectable()
export class CopernicusClient {
    private readonly client: AxiosInstance;

    constructor(
        private readonly sentinelHubAuthService: SentinelHubAuthService,
    ) {
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

    async calculateNdvi(params: {
        bbox: [number, number, number, number];
        date: string;
    }): Promise<unknown> {
        const token = await this.sentinelHubAuthService.getAccessToken();

        const response = await axios.post(
            "https://sh.dataspace.copernicus.eu/process/v1",
            {
                input: {
                    bounds: {
                        bbox: params.bbox,
                    },
                    data: [
                        {
                            type: "sentinel-2-l2a",
                            dataFilter: {
                                timeRange: {
                                    from: `${params.date}T00:00:00Z`,
                                    to: `${params.date}T23:59:59Z`,
                                },
                            },
                        },
                    ],
                },

                output: {
                    responses: [
                        {
                            identifier: "default",
                            format: {
                                type: "application/json",
                            },
                        },
                    ],
                },

                evalscript: `//VERSION=3

function setup() {
    return {
        input: ["B04", "B08"],
        output: [
            {
                id: "default",
                bands: 1,
                sampleType: "FLOAT32"
            }
        ]
    };
}

function evaluatePixel(sample) {
    return [
        (sample.B08 - sample.B04) /
        (sample.B08 + sample.B04)
    ];
}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            },
        );

        return response.data;
    }

    async calculateNdviStatistics(params: {
        geometry: GeoJSON.Geometry;
        from: string;
        to: string;
    }): Promise<NdviResponseDto> {
        const token = await this.sentinelHubAuthService.getAccessToken();

        const { crs: _geometryCrs, ...geometry } =
            params.geometry as GeoJSON.Geometry & { crs?: unknown };

        try {
            const response = await axios.post(
                "https://sh.dataspace.copernicus.eu/statistics/v1",
                {
                    input: {
                        bounds: {
                            geometry,
                            properties: {
                                crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
                            },
                        },
                        data: [
                            {
                                type: "sentinel-2-l2a",
                                dataFilter: {
                                    timeRange: {
                                        from: params.from,
                                        to: params.to,
                                    },
                                },
                            },
                        ],
                    },

                    aggregation: {
                        timeRange: {
                            from: params.from,
                            to: params.to,
                        },

                        aggregationInterval: {
                            of: "P1D",
                        },

                        width: 1024,
                        height: 1024,

                        evalscript: `//VERSION=3

function setup() {
    return {
        input: [
            "B04",
            "B08",
            "dataMask"
        ],
        output: [
            {
                id: "default",
                bands: 1,
                sampleType: "FLOAT32"
            },
            {
                id: "dataMask",
                bands: 1
            }
        ]
    };
}

function evaluatePixel(sample) {
    let ndvi =
        (sample.B08 - sample.B04) /
        (sample.B08 + sample.B04);

    return {
        default: [ndvi],
        dataMask: [sample.dataMask]
    };
}`,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            return {
                from: params.from,
                to: params.to,
                statistics: response.data.data.map((item: any) => ({
                    date: item.interval.from.split("T")[0],
                    mean: item.outputs.default.bands.B0.stats.mean,
                    min: item.outputs.default.bands.B0.stats.min,
                    max: item.outputs.default.bands.B0.stats.max,
                    stdDev: item.outputs.default.bands.B0.stats.stDev,
                })),
            };
        } catch {
            throw new BadRequestException("Failed to calculate NDVI");
        }
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
