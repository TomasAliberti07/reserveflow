import { Module } from '@nestjs/common';
import { BebidaController } from './bebida.controller';
import { BebidaService } from './bebida.service';

@Module({
  controllers: [BebidaController],
  providers: [BebidaService]
})
export class BebidaModule {}
