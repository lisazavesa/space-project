import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EarthObservationService } from "./earth-observation.service";
import { SearchObservationsDto } from "./dto/search-observations.dto";

@Controller("earth-observation")
export class EarthObservationController {
    constructor(
        private readonly earthObservationService: EarthObservationService,
    ) {}

    @Get("collections")
    getCollections() {
        return this.earthObservationService.getCollections();
    }

    @Post("areas/:areaId/search")
    searchObservations(
        @Param("areaId") areaId: string,
        @Body() dto: SearchObservationsDto,
    ) {
        return this.earthObservationService.searchObservations(areaId, dto);
    }

    @Post("areas/:areaId/best")
    getBestObservation(
        @Param("areaId") areaId: string,
        @Body() dto: SearchObservationsDto,
    ) {
        return this.earthObservationService.getBestObservation(areaId, dto);
    }

    @Get("areas/:areaId/observations")
    getObservations(@Param("areaId") areaId: string) {
        return this.earthObservationService.getObservations(areaId);
    }

    @Get("areas/:areaId/observations/statistics")
    getObservationStatistics(@Param("areaId") areaId: string) {
        return this.earthObservationService.getObservationStatistics(areaId);
    }
}
