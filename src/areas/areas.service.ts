import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreasService { 
  constructor(
    @InjectRepository(Area)
    private readonly areasRepository: Repository<Area>,
  ) {}
  
  create(createAreaDto: CreateAreaDto) {
    return 'This action adds a new area';
  }

  findAll() {
    return `This action returns all areas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
