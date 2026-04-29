import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonsService } from './salons.service';
import { SalonsController } from './salons.controller';
import { Salones } from './salons.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salones])],
  controllers: [SalonsController],
  providers: [SalonsService],
})
export class SalonsModule {}
