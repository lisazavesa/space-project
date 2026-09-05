import { Module } from '@nestjs/common';
import { EarthObservationService } from './earth-observation.service';
import { EarthObservationController } from './earth-observation.controller';
import { CopernicusClient } from './clients/copernicus.client';
import { AreasModule } from 'src/areas/areas.module';
import { ObservationScoringService } from './services/observation-scoring.service';

@Module({
  imports: [AreasModule],
  providers: [EarthObservationService, CopernicusClient, ObservationScoringService],
  controllers: [EarthObservationController]
})
export class EarthObservationModule {}
