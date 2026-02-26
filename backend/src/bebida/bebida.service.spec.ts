import { Test, TestingModule } from '@nestjs/testing';
import { BebidaService } from './bebida.service';

describe('BebidaService', () => {
  let service: BebidaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BebidaService],
    }).compile();

    service = module.get<BebidaService>(BebidaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
