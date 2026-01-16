import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonsService } from './salons.service';
import { SalonsController } from './salons.controller';
import { Salon } from './salons.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salon])],
  controllers: [SalonsController],
  providers: [SalonsService],
})
export class SalonsModule {}
