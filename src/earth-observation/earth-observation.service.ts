import { Injectable } from "@nestjs/common";
import { CopernicusClient } from "./clients/copernicus.client";
import { CollectionResponseDto } from "./dto/collection-response.dto";
import { CopernicusMapper } from "./mappers/copernicus.mapper";
import { SearchObservationsDto } from "./dto/search-observations.dto";
import { AreasService } from "src/areas/areas.service";
import { SearchObservationsResponseDto } from "./dto/search-observations-response.dto";

@Injectable()
export class EarthObservationService {
    constructor(
        private readonly copernicusClient: CopernicusClient,
        private readonly areasService: AreasService,
    ) {}

    async getCollections(): Promise<CollectionResponseDto[]> {
        const response = await this.copernicusClient.getCollections();

        return response.collections.map(CopernicusMapper.toCollectionResponse);
    }

    async searchObservations(
        areaId: string,
        dto: SearchObservationsDto,
    ): Promise<SearchObservationsResponseDto> {
        const boundingBox = await this.areasService.getBoundingBox(areaId);

        const response = await this.copernicusClient.searchItems({
            bbox: [
                boundingBox.west,
                boundingBox.south,
                boundingBox.east,
                boundingBox.north,
            ],
            startDate: dto.startDate,
            endDate: dto.endDate,
            maxCloudCover: dto.maxCloudCover,
        });

        const observations = await Promise.all(
            response.features.map(async (item) => {
                const observation =
                    CopernicusMapper.toObservationResponse(item);

                const coveragePercentage =
                    await this.areasService.calculateSceneCoverage(
                        areaId,
                        item.geometry,
                    );

                return {
                    ...observation,
                    coveragePercentage,
                };
            }),
        );

        return {
            total: observations.length,
            observations,
        };
    }
}
