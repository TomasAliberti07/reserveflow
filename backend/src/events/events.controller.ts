import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Event>) {
    return this.eventsService.create(data);
  }
}
