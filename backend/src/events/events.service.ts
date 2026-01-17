import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './events.entity';
import { Salon } from '../salons/salons.entity';    

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
  ) {}

  async findAll() {
    return this.eventRepository.find({ relations: ['salon'] });
  } 

  async create(eventData: Partial<Event>) {
    const salon = await this.salonRepository.findOne({
      where: { id: eventData.salon?.id },
    });

    if (!salon || !salon.estado) {
      throw new BadRequestException('Salón no disponible');
    }

    // Validación de horarios horarios
    const overlappingEvent = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.salon_id = :salonId', { salonId: salon.id })
      .andWhere('event.estado != :estadoCancelado', {
      estadoCancelado: 'cancelado',
    })
      .andWhere(
      'event.comienzo < :finaliza AND event.finaliza > :comienzo',
      {
        comienzo: eventData.comienzo,
        finaliza: eventData.finaliza,
      },
    )
.getOne();

if (overlappingEvent) {
  throw new BadRequestException(
    'El salón ya está reservado en el horario seleccionado',
  );
}

    if (
      !eventData.cant_invitados ||
      eventData.cant_invitados < salon.mincapacidad ||
      eventData.cant_invitados > salon.maxcapacidad
    ) {
      throw new BadRequestException(
        'Cantidad de invitados fuera del rango permitido',
      );
    }

    if (!eventData.comienzo || !eventData.finaliza || eventData.comienzo >= eventData.finaliza) {
      throw new BadRequestException(
        'La fecha de comienzo debe ser anterior a la de finalización',
      );
    }

    return this.eventRepository.save(eventData);
  }
}
