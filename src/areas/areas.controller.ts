import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { FindAreasByPointDto } from './dto/find-areas-by-point.dto';
import { FindIntersectingAreasDto } from './dto/find-intersecting-areas.dto';
import { FindNearbyAreasDto } from './dto/find-nearby-areas.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Post('intersecting')
  findIntersecting(@Body() dto: FindIntersectingAreasDto) {
    return this.areasService.findIntersectingAreas(dto.geometry);
  }

  @Get()
  findAll() {
    return this.areasService.findAll();
  }

  @Get('containing-point')
  findContainingPoint(@Query() query: FindAreasByPointDto) {
    return this.areasService.findContainingPoint(
      query.longitude,
      query.latitude,
    );
  }

  @Get('nearby')
  findNearby(@Query() query: FindNearbyAreasDto) {
    return this.areasService.findNearby(
      query.longitude,
      query.latitude,
      query.distance,
    );
  }

  @Get(':id/bounding-box')
  getBoundingBox(@Param('id') id: string) {
    return this.areasService.getBoundingBox(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findOneWithArea(id);
  }
}