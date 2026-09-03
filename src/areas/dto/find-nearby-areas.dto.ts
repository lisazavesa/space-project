import { Type } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, Max, Min } from "class-validator";

export class FindNearbyAreasDto {
    @Type(() => Number)
    @IsLongitude()
    longitude!: number;

    @Type(() => Number)
    @IsLatitude()
    latitude!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(1000000)
    distance!: number;
}
