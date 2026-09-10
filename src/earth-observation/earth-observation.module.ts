import { Module } from "@nestjs/common";
import { EarthObservationService } from "./earth-observation.service";
import { EarthObservationController } from "./earth-observation.controller";
import { CopernicusClient } from "./clients/copernicus.client";
import { AreasModule } from "src/areas/areas.module";
import { ObservationScoringService } from "./services/observation-scoring.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Observation } from "./entities/observation.entity";
import { SentinelHubAuthService } from "./services/sentinel-hub-auth.service";

@Module({
    imports: [AreasModule, TypeOrmModule.forFeature([Observation])],
    providers: [
        EarthObservationService,
        CopernicusClient,
        ObservationScoringService,
        SentinelHubAuthService,
    ],
    controllers: [EarthObservationController],
})
export class EarthObservationModule {}