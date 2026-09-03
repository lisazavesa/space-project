import { Type } from "class-transformer";
import { IsLatitude, IsLongitude } from "class-validator";

export class FindAreasByPointDto {
    @Type(() => Number)
    @IsLongitude()
    longitude!: number;

    @Type(() => Number)
    @IsLatitude()
    latitude!: number;
}
