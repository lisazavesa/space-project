import { IsNotEmpty } from "class-validator";
import type { Polygon } from "geojson";

export class FindIntersectingAreasDto {
    @IsNotEmpty()
    geometry!: Polygon;
}
