import { IsNotEmpty } from "class-validator";
import type { Polygon } from "geojson";
import { ApiProperty } from "@nestjs/swagger";

export class FindIntersectingAreasDto {
    @ApiProperty({
        type: "object",
        additionalProperties: true,
        description: "GeoJSON Polygon in WGS84 coordinates",
    })
    @IsNotEmpty()
    geometry!: Polygon;
}
