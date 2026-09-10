import { IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CalculateNdviDto {
    @ApiProperty({ example: "2025-01-01" })
    @IsDateString()
    from!: string;

    @ApiProperty({ example: "2025-01-31" })
    @IsDateString()
    to!: string;
}
