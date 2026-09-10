import { Injectable } from "@nestjs/common";
import { CopernicusClient } from "./clients/copernicus.client";
import { CollectionResponseDto } from "./dto/collection-response.dto";
import { CopernicusMapper } from "./mappers/copernicus.mapper";
import { SearchObservationsDto } from "./dto/search-observations.dto";
import { AreasService } from "src/areas/areas.service";
import { SearchObservationsResponseDto } from "./dto/search-observations-response.dto";
import { ObservationScoringService } from "./services/observation-scoring.service";
import { BestObservationResponseDto } from "./dto/best-observation-response.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Observation } from "./entities/observation.entity";
import { Repository } from "typeorm";
import { ObservationStatisticsResponseDto } from "./dto/observation-statistics-response.dto";
import { ObservationHistoryResponseDto } from "./dto/observation-history-response.dto";
import { CalculateNdviDto } from "./dto/calculate-ndvi.dto";

@Injectable()
export class EarthObservationService {
    constructor(
        private readonly copernicusClient: CopernicusClient,
        private readonly areasService: AreasService,
        private readonly observationScoringService: ObservationScoringService,

        @InjectRepository(Observation)
        private readonly observationsRepository: Repository<Observation>,
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

        if (observations.length === 0) {
            return {
                total: 0,
                observations: [],
            };
        }

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

        await this.observationsRepository.upsert(
            observationsWithScores.map((observation) => ({
                externalId: observation.id,
                areaId,
                observedAt: new Date(observation.observedAt),
                cloudCover: observation.cloudCover,
                coveragePercentage: observation.coveragePercentage,
                score: observation.score,
                geometry: observation.geometry as GeoJSON.Polygon,
                bbox: observation.bbox,
                collection: "sentinel-2-l2a",
                assets: null,
            })),
            ["areaId", "externalId"],
        );

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

    async getObservations(
        areaId: string,
    ): Promise<ObservationHistoryResponseDto> {
        const observations = await this.observationsRepository.find({
            where: { areaId },
            order: { observedAt: "DESC" },
        });

        return {
            observations: observations.map((observation) => ({
                id: observation.externalId,
                observedAt: observation.observedAt.toISOString(),
                cloudCover: observation.cloudCover,
                geometry: observation.geometry,
                bbox: observation.bbox,
                coveragePercentage: observation.coveragePercentage,
                score: observation.score,
            })),
        };
    }

    async getObservationStatistics(
        areaId: string,
    ): Promise<ObservationStatisticsResponseDto> {
        const result = await this.observationsRepository
            .createQueryBuilder("observation")
            .select("COUNT(observation.id)", "totalObservations")
            .addSelect("AVG(observation.cloudCover)", "averageCloudCover")
            .addSelect("AVG(observation.coveragePercentage)", "averageCoverage")
            .addSelect("MAX(observation.score)", "bestScore")
            .addSelect("MAX(observation.observedAt)", "latestObservation")
            .addSelect("MIN(observation.observedAt)", "oldestObservation")
            .where("observation.areaId = :areaId", { areaId })
            .getRawOne();

        return {
            totalObservations: Number(result.totalObservations),
            averageCloudCover:
                result.averageCloudCover !== null
                    ? Number(Number(result.averageCloudCover).toFixed(2))
                    : null,
            averageCoverage:
                result.averageCoverage !== null
                    ? Number(Number(result.averageCoverage).toFixed(2))
                    : null,
            bestScore:
                result.bestScore !== null
                    ? Number(Number(result.bestScore).toFixed(2))
                    : null,
            latestObservation: result.latestObservation
                ? new Date(result.latestObservation).toISOString()
                : null,
            oldestObservation: result.oldestObservation
                ? new Date(result.oldestObservation).toISOString()
                : null,
        };
    }

    async calculateNdvi(areaId: string, dto: CalculateNdviDto) {
        const geometry =
            await this.areasService.getGeometryForSentinelHub(areaId);

        return this.copernicusClient.calculateNdviStatistics({
            geometry,
            from: dto.from,
            to: dto.to,
        });
    }
}
