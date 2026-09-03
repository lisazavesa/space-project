import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { FindAreasByPointDto } from './dto/find-areas-by-point.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
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
}
