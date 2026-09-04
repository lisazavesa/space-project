import { ObservationResponseDto } from "./observation-response.dto";

export class SearchObservationsResponseDto {
    total!: number;
    observations!: ObservationResponseDto[];
}
