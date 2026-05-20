import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './events.entity';
import { Salones } from '../salons/salons.entity';
import { CreateEventDto } from '../dto/create_events_dto';
import { UpdateEventDto } from '../dto/update_events_dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(Salones)
    private salonRepository: Repository<Salones>,
  ) {}

  async findAll() {
    return this.eventRepository.find({ relations: ['salon'] });
  }

  async create(createEventDto: CreateEventDto, userId: number) {
    const salon = await this.salonRepository.findOne({
      where: { id: createEventDto.salon_id },
    });

    if (!salon || !salon.estado) {
      throw new BadRequestException('Salón no disponible');
    }

    // Validación de horarios
    const overlappingEvent = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.salon_id = :salonId', { salonId: salon.id })
      .andWhere('event.estado != :estadoCancelado', {
        estadoCancelado: 'cancelado',
      })
      .andWhere(
        'event.comienzo < :finaliza AND event.finaliza > :comienzo',
        {
          comienzo: createEventDto.comienzo,
          finaliza: createEventDto.finaliza,
        },
      )
      .getOne();

    if (overlappingEvent) {
      throw new BadRequestException(
        'El salón ya está reservado en el horario seleccionado',
      );
    }

    if (
      !createEventDto.cant_invitados ||
      createEventDto.cant_invitados < salon.mincapacidad ||
      createEventDto.cant_invitados > salon.maxcapacidad
    ) {
      throw new BadRequestException(
        'Cantidad de invitados fuera del rango permitido',
      );
    }

    if (
      !createEventDto.comienzo ||
      !createEventDto.finaliza ||
      new Date(createEventDto.comienzo) >= new Date(createEventDto.finaliza)
    ) {
      throw new BadRequestException(
        'La fecha de comienzo debe ser anterior a la de finalización',
      );
    }

    const newEvent = this.eventRepository.create({
      cliente_nombre: createEventDto.cliente_nombre,
      cliente_apellido: createEventDto.cliente_apellido,
      cliente_email: createEventDto.cliente_email,
      cliente_numero: createEventDto.cliente_numero,
      cant_invitados: createEventDto.cant_invitados,
      comienzo: createEventDto.comienzo,
      finaliza: createEventDto.finaliza,
      estado: createEventDto.estado,
      notas: createEventDto.notas,
      salon: { id: createEventDto.salon_id } as any,
    });

    return this.eventRepository.save(newEvent);
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    userId: number,
  ) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['salon'],
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Validación: solo el usuario que creó el evento puede actualizarlo
    // Si no tienes relación con user, comenta esta validación o implementa según tu estructura
    // if (event.user?.id !== userId) {
    //   throw new ForbiddenException('No tienes permiso para actualizar este evento');
    // }

    // Si se actualiza el salón, validar disponibilidad
    if (updateEventDto.salon_id && updateEventDto.salon_id !== event.salon.id) {
      const newSalon = await this.salonRepository.findOne({
        where: { id: updateEventDto.salon_id },
      });

      if (!newSalon || !newSalon.estado) {
        throw new BadRequestException('Salón no disponible');
      }

      // Validación de horarios para el nuevo salón
      const overlappingEvent = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.id != :eventId', { eventId: id })
        .andWhere('event.salon_id = :salonId', { salonId: newSalon.id })
        .andWhere('event.estado != :estadoCancelado', {
          estadoCancelado: 'cancelado',
        })
        .andWhere(
          'event.comienzo < :finaliza AND event.finaliza > :comienzo',
          {
            comienzo: updateEventDto.comienzo || event.comienzo,
            finaliza: updateEventDto.finaliza || event.finaliza,
          },
        )
        .getOne();

      if (overlappingEvent) {
        throw new BadRequestException(
          'El salón ya está reservado en el horario seleccionado',
        );
      }
    }

    // Validar capacidad si se actualiza la cantidad de invitados
    if (updateEventDto.cant_invitados) {
      const salonToValidate = updateEventDto.salon_id
        ? await this.salonRepository.findOne({
            where: { id: updateEventDto.salon_id },
          })
        : event.salon;

      if (!salonToValidate) {
        throw new NotFoundException('El salón especificado no existe.');
      }

      if (
        updateEventDto.cant_invitados < salonToValidate.mincapacidad ||
        updateEventDto.cant_invitados > salonToValidate.maxcapacidad
      ) {
        throw new BadRequestException(
          'Cantidad de invitados fuera del rango permitido',
        );
      }
    }

    // Validar fechas si se actualizan
    if (
      updateEventDto.comienzo ||
      updateEventDto.finaliza
    ) {
      const comienzo = new Date(updateEventDto.comienzo || event.comienzo);
      const finaliza = new Date(updateEventDto.finaliza || event.finaliza);

      if (comienzo >= finaliza) {
        throw new BadRequestException(
          'La fecha de comienzo debe ser anterior a la de finalización',
        );
      }
    }

    Object.assign(event, updateEventDto);
    if (updateEventDto.salon_id) {
      event.salon = { id: updateEventDto.salon_id } as any;
    }

    return this.eventRepository.save(event);
  }

  async delete(id: number, userId: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['salon'],
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Validación: solo el usuario que creó el evento puede eliminarlo
    // Si no tienes relación con user, comenta esta validación o implementa según tu estructura
    // if (event.user?.id !== userId) {
    //   throw new ForbiddenException('No tienes permiso para eliminar este evento');
    // }

    return this.eventRepository.remove(event);
  }
}
