import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create_events_dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
