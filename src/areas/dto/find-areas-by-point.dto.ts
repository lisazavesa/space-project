import { Type } from "class-transformer";
import { IsLatitude, IsLongitude } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindAreasByPointDto {
    @ApiProperty({ example: 30.3141 })
    @Type(() => Number)
    @IsLongitude()
    longitude!: number;

    @ApiProperty({ example: 59.9386 })
    @Type(() => Number)
    @IsLatitude()
    latitude!: number;
}
