import { Injectable } from "@nestjs/common";
import { ObservationResponseDto } from "../dto/observation-response.dto";

@Injectable()
export class ObservationScoringService {
    calculateScore(
        observation: ObservationResponseDto,
        newestObservationDate: Date,
    ): number {
        const cloudScore = this.calculateCloudScore(observation.cloudCover); // облака

        const coverageScore = this.calculateCoverageScore( //покрытие снимком территории
            observation.coveragePercentage,
        );

        const recencyScore = this.calculateRecencyScore( // актуальность снимка
            observation.observedAt,
            newestObservationDate,
        );

        return Number((cloudScore + coverageScore + recencyScore).toFixed(2));
    }

    private calculateCloudScore(cloudCover: number | null): number {
        if (cloudCover === null) {
            return 0;
        }

        return (100 - cloudCover) * 0.5;
    }

    private calculateCoverageScore(coveragePercentage: number | null): number {
        if (coveragePercentage === null) {
            return 0;
        }

        return coveragePercentage * 0.4;
    }

    private calculateRecencyScore(
        observedAt: string,
        newestObservationDate: Date,
    ): number {
        const observationDate = new Date(observedAt);

        const differenceInMilliseconds =
            newestObservationDate.getTime() - observationDate.getTime();

        const differenceInDays =
            differenceInMilliseconds / (1000 * 60 * 60 * 24);

        const recencyScore = Math.max(0, 10 - differenceInDays);

        return recencyScore;
    }
}
