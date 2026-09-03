import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Polygon, Repository } from 'typeorm';

@Injectable()
export class AreasService { 
  constructor(
    @InjectRepository(Area)
    private readonly areasRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    const { name, description, geometry } = createAreaDto;

    if (geometry.type !== 'Polygon') {
      throw new BadRequestException('Geometry must be a Polygon');
    }

    const isValid = await this.validateGeometry(geometry);

    if (!isValid) {
      throw new BadRequestException('Invalid polygon geometry');
    }

    const area = this.areasRepository.create({
      name,
      description,
      geometry,
    });

    return await this.areasRepository.save(area);
  }

  findAll() {
    return this.areasRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private async validateGeometry(geometry: object): Promise<boolean> {
    const result = await this.areasRepository.query(
      `
        SELECT ST_IsValid(
          ST_SetSRID(
            ST_GeomFromGeoJSON($1),
            4326
          )
        ) AS "isValid"
      `,
      [JSON.stringify(geometry)],
    );

    return result[0].isValid;
  }

  async findContainingPoint(
    longitude: number,
    latitude: number,
  ): Promise<Area[]> {
    return this.areasRepository
      .createQueryBuilder('area')
      .where(
        `
          ST_Contains(
            area.geometry,
            ST_SetSRID(
              ST_MakePoint(:longitude, :latitude),
              4326
            )
          )
        `,
        {
          longitude,
          latitude,
        },
      )
      .getMany();
  }

  async findIntersectingAreas(geometry: Polygon): Promise<Area[]> {
    if (geometry.type !== 'Polygon') {
      throw new BadRequestException('Geometry must be a Polygon');
    }

    const isValid = await this.validateGeometry(geometry);

    if (!isValid) {
      throw new BadRequestException('Invalid polygon geometry');
    }

    return this.areasRepository
      .createQueryBuilder('area')
      .where(
        `
          ST_Intersects(
            area.geometry,
            ST_SetSRID(
              ST_GeomFromGeoJSON(:geometry),
              4326
            )
          )
        `,
        {
          geometry: JSON.stringify(geometry),
        },
      )
      .getMany();
  }

  async findOneWithArea(id: string) {
    const result = await this.areasRepository
      .createQueryBuilder('area')
      .select([
        'area.id AS id',
        'area.name AS name',
        'area.description AS description',
        'ST_AsGeoJSON(area.geometry)::json AS geometry',
        'area.createdAt AS "createdAt"',
        'area.updatedAt AS "updatedAt"',
        'ST_Area(area.geometry::geography) AS "areaSquareMeters"',
      ])
      .where('area.id = :id', { id })
      .getRawOne();
  
    if (!result) {
      throw new NotFoundException('Area not found');
    }
  
    return {
      ...result,
      areaSquareMeters: Number(result.areaSquareMeters),
    };
  }

  async findNearby(
    longitude: number,
    latitude: number,
    distance: number,
  ): Promise<Area[]> {
    return this.areasRepository
      .createQueryBuilder('area')
      .where(
        `
          ST_DWithin(
            area.geometry::geography,
            ST_SetSRID(
              ST_MakePoint(:longitude, :latitude),
              4326
            )::geography,
            :distance
          )
        `,
        {
          longitude,
          latitude,
          distance,
        },
      )
      .getMany();
  }
}
