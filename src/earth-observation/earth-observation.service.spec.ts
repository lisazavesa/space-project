import { Test, TestingModule } from '@nestjs/testing';
import { EarthObservationService } from './earth-observation.service';

describe('EarthObservationService', () => {
  let service: EarthObservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarthObservationService],
    }).compile();

    service = module.get<EarthObservationService>(EarthObservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
