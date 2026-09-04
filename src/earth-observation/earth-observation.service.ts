import { Injectable } from "@nestjs/common";
import { CopernicusClient } from "./clients/copernicus.client";
import { CollectionResponseDto } from "./dto/collection-response.dto";
import { CopernicusMapper } from "./mappers/copernicus.mapper";

@Injectable()
export class EarthObservationService {
    constructor(private readonly copernicusClient: CopernicusClient) {}

    async getCollections(): Promise<CollectionResponseDto[]> {
        const response = await this.copernicusClient.getCollections();

        return response.collections.map(CopernicusMapper.toCollectionResponse);
    }
}
