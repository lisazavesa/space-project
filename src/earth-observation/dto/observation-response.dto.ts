export class ObservationResponseDto {
    id!: string;
    observedAt!: string;
    cloudCover!: number | null;
    geometry!: GeoJSON.Geometry;
    bbox!: number[] | null;
    coveragePercentage!: number | null;
}
