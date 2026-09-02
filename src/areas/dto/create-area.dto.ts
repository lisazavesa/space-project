import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from "class-validator";
import type { Polygon } from "geojson";

export class CreateAreaDto {
    @IsString()
    @Length(3, 100)
    name!: string;

    @IsOptional()
    @IsString()
    @Length(1, 1000)
    description?: string;

    @IsNotEmpty()
    geometry!: Polygon;
}
