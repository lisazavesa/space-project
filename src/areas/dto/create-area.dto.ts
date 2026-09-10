import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from "class-validator";
import type { Polygon } from "geojson";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAreaDto {
    @ApiProperty({ example: "Agricultural field" })
    @IsString()
    @Length(3, 100)
    name!: string;

    @ApiPropertyOptional({ example: "Field near the river" })
    @IsOptional()
    @IsString()
    @Length(1, 1000)
    description?: string;

    @ApiProperty({
        type: "object",
        additionalProperties: true,
        description: "GeoJSON Polygon in WGS84 coordinates",
        example: {
            type: "Polygon",
            coordinates: [
                [
                    [30.1, 59.9],
                    [30.2, 59.9],
                    [30.2, 60.0],
                    [30.1, 59.9],
                ],
            ],
        },
    })
    @IsNotEmpty()
    geometry!: Polygon;
}
