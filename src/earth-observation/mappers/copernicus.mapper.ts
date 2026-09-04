import { CollectionResponseDto } from "../dto/collection-response.dto";
import { CopernicusCollection } from "../types/copernicus.types";

export class CopernicusMapper {
    static toCollectionResponse(
        collection: CopernicusCollection,
    ): CollectionResponseDto {
        return {
            id: collection.id,
            title: collection.title ?? null,
        };
    }
}
