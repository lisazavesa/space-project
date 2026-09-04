import { Test, TestingModule } from '@nestjs/testing';
import { EarthObservationController } from './earth-observation.controller';

describe('EarthObservationController', () => {
  let controller: EarthObservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EarthObservationController],
    }).compile();

    controller = module.get<EarthObservationController>(EarthObservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
