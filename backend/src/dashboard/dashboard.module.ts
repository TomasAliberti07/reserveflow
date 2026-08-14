import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Salones } from '../salons/salons.entity';
import { Event } from '../events/events.entity';
import { Pedido } from '../pedidos/pedidos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salones, Event, Pedido])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}