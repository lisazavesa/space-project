import { Controller, Get } from '@nestjs/common';
import { EarthObservationService } from './earth-observation.service';

@Controller('earth-observation')
export class EarthObservationController {
    constructor(private readonly earthObservationService: EarthObservationService) {}

    @Get('collections')
    getCollections() {
        return this.earthObservationService.getCollections();
    }
}
