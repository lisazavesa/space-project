export class NdviStatisticsDto {
    date!: string;
    mean!: number;
    min!: number;
    max!: number;
    stdDev!: number;
}

export class NdviResponseDto {
    from!: string;
    to!: string;
    statistics!: NdviStatisticsDto[];
}
