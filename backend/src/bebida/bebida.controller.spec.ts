import { Test, TestingModule } from '@nestjs/testing';
import { BebidaController } from './bebida.controller';

describe('BebidaController', () => {
  let controller: BebidaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BebidaController],
    }).compile();

    controller = module.get<BebidaController>(BebidaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
