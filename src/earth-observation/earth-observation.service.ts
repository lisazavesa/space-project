import { Injectable } from "@nestjs/common";
import { CopernicusClient } from "./clients/copernicus.client";
import { CollectionResponseDto } from "./dto/collection-response.dto";
import { CopernicusMapper } from "./mappers/copernicus.mapper";
import { SearchObservationsDto } from "./dto/search-observations.dto";
import { AreasService } from "src/areas/areas.service";
import { SearchObservationsResponseDto } from "./dto/search-observations-response.dto";
import { ObservationScoringService } from "./services/observation-scoring.service";
import { BestObservationResponseDto } from "./dto/best-observation-response.dto";

@Injectable()
export class EarthObservationService {
    constructor(
        private readonly copernicusClient: CopernicusClient,
        private readonly areasService: AreasService,
        private readonly observationScoringService: ObservationScoringService,
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

        const newestObservationDate = new Date(
            Math.max(
                ...observations.map((observation) =>
                    new Date(observation.observedAt).getTime(),
                ),
            ),
        );

        const observationsWithScores = observations.map((observation) => ({
            ...observation,
            score: this.observationScoringService.calculateScore(
                observation,
                newestObservationDate,
            ),
        }));

        return {
            total: observationsWithScores.length,
            observations: observationsWithScores,
        };
    }

    async getBestObservation(
        areaId: string,
        dto: SearchObservationsDto,
    ): Promise<BestObservationResponseDto> {
        const result = await this.searchObservations(areaId, dto);

        if (result.observations.length === 0) {
            return {
                bestObservation: null,
            };
        }

        const bestObservation = result.observations.reduce((best, current) => {
            return current.score! > best.score! ? current : best;
        });

        return {
            bestObservation,
        };
    }
}
