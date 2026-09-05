import { CollectionResponseDto } from "../dto/collection-response.dto";
import { ObservationResponseDto } from "../dto/observation-response.dto";
import { CopernicusCollection, CopernicusStacItem } from "../types/copernicus.types";

export class CopernicusMapper {
    static toCollectionResponse(
        collection: CopernicusCollection,
    ): CollectionResponseDto {
        return {
            id: collection.id,
            title: collection.title ?? null,
        };
    }

    static toObservationResponse(
        item: CopernicusStacItem,
    ): ObservationResponseDto {
        return {
            id: item.id,
            observedAt: item.properties.datetime,
            cloudCover: item.properties["eo:cloud_cover"] ?? null,
            geometry: item.geometry,
            bbox: item.bbox ?? null,
            coveragePercentage: null, // later
        };
    }
}
