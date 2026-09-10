import { Type } from "class-transformer";
import { IsDateString, IsNumber, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SearchObservationsDto {
    @ApiProperty({ example: "2025-01-01" })
    @IsDateString()
    startDate!: string;

    @ApiProperty({ example: "2025-01-31" })
    @IsDateString()
    endDate!: string;

    @ApiProperty({ example: 20, minimum: 0, maximum: 100 })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(100)
    maxCloudCover!: number;
}
