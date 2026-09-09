export class ObservationStatisticsResponseDto {
    totalObservations!: number;
    averageCloudCover!: number | null;
    averageCoverage!: number | null;
    bestScore!: number | null;
    latestObservation!: string | null;
    oldestObservation!: string | null;
}
