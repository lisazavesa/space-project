import { Type } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindNearbyAreasDto {
    @ApiProperty({ example: 30.3141 })
    @Type(() => Number)
    @IsLongitude()
    longitude!: number;

    @ApiProperty({ example: 59.9386 })
    @Type(() => Number)
    @IsLatitude()
    latitude!: number;

    @ApiProperty({ example: 1000, description: "Distance in meters" })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(1000000)
    distance!: number;
}
