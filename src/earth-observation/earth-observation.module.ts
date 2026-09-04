import { Module } from '@nestjs/common';
import { EarthObservationService } from './earth-observation.service';
import { EarthObservationController } from './earth-observation.controller';
import { CopernicusClient } from './clients/copernicus.client';
import { AreasModule } from 'src/areas/areas.module';

@Module({
  imports: [AreasModule],
  providers: [EarthObservationService, CopernicusClient],
  controllers: [EarthObservationController]
})
export class EarthObservationModule {}
