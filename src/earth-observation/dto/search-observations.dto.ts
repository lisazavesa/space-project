import { Type } from "class-transformer";
import { IsDateString, IsNumber, Max, Min } from "class-validator";

export class SearchObservationsDto {
    @IsDateString()
    startDate!: string;

    @IsDateString()
    endDate!: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(100)
    maxCloudCover!: number;
}
