import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BebidaController } from './bebida.controller';
import { BebidaService } from './bebida.service';
import { Bebida } from './bebida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bebida])],
  controllers: [BebidaController],
  providers: [BebidaService],
})
export class BebidaModule {}
