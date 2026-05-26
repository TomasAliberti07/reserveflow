import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './events.entity';
import { Salones} from '../salons/salons.entity';
import { Eventomenus } from './eventomenus.entity';
import { Eventobebida } from './eventobebida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Salones, Eventomenus, Eventobebida])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
