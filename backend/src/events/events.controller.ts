import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt_auth_guard';
import { CreateEventDto } from '../dto/create_events_dto';
import { UpdateEventDto } from '../dto/update_events_dto';
import { Request } from 'express';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    return this.eventsService.create(createEventDto, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.id;
    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Req() req: Request) {
    const userId = (req.user as any)?.id;
    return this.eventsService.delete(id, userId);
  }
}
