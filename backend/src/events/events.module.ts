import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './events.entity';
import { Salon } from '../salons/salons.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Salon])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
