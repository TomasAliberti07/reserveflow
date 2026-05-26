import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './events.entity';
import { Salones } from '../salons/salons.entity';
import { Eventomenus } from './eventomenus.entity';
import { Eventobebida } from './eventobebida.entity';
import { CreateEventDto, EventEstado } from '../dto/create_events_dto';
import { UpdateEventDto } from '../dto/update_events_dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(Salones)
    private salonRepository: Repository<Salones>,

    // Inyectamos los dos repositorios de las tablas relacionales intermedias
    @InjectRepository(Eventomenus)
    private eventomenusRepository: Repository<Eventomenus>,

    @InjectRepository(Eventobebida)
    private eventobebidaRepository: Repository<Eventobebida>,
  ) {}

  async findAll() {
    // Agregamos las relaciones para que cuando listemos los eventos traiga su menú y bebidas
    return this.eventRepository.find({ 
      relations: ['salon', 'eventomenus', 'eventomenus.menu', 'eventobebidas', 'eventobebidas.bebida'] 
    });
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

    // MODIFICACIÓN: Si el estado es PENDIENTE y no mandan invitados (o mandan 0), se saltea la validación de rango
    const esPendienteVacio = createEventDto.estado === EventEstado.PENDIENTE && (!createEventDto.cant_invitados || createEventDto.cant_invitados === 0);
    
    if (!esPendienteVacio) {
      if (
        !createEventDto.cant_invitados ||
        createEventDto.cant_invitados < salon.mincapacidad ||
        createEventDto.cant_invitados > salon.maxcapacidad
      ) {
        throw new BadRequestException(
          'Cantidad de invitados fuera del rango permitido',
        );
      }
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

    // 1. Creamos y guardamos primero el evento base
    const newEvent = this.eventRepository.create({
      cliente_nombre: createEventDto.cliente_nombre,
      cliente_apellido: createEventDto.cliente_apellido,
      cliente_email: createEventDto.cliente_email,
      cliente_numero: createEventDto.cliente_numero,
      cant_invitados: createEventDto.cant_invitados || 0,
      comienzo: createEventDto.comienzo,
      finaliza: createEventDto.finaliza,
      estado: createEventDto.estado,
      notas: createEventDto.notas,
      salon: { id: createEventDto.salon_id } as any,
    });

    const savedEvent = await this.eventRepository.save(newEvent);

    // 2. Si mandaron un menú asignado, lo guardamos en la tabla intermedia
    if (createEventDto.menu_id) {
      const nuevoMenuAsignado = this.eventomenusRepository.create({
        evento_id: savedEvent.id,
        menu_id: createEventDto.menu_id,
        cantidad: createEventDto.menu_cantidad || createEventDto.cant_invitados || 1,
      });
      await this.eventomenusRepository.save(nuevoMenuAsignado);
    }

    // 3. Si mandaron bebidas en la lista, las guardamos en lote en su tabla intermedia
    if (createEventDto.bebidas && createEventDto.bebidas.length > 0) {
      const bebidasParaGuardar = createEventDto.bebidas.map((b) => 
        this.eventobebidaRepository.create({
          evento_id: savedEvent.id,
          bebida_id: b.bebida_id,
          cant: b.cant,
        })
      );
      await this.eventobebidaRepository.save(bebidasParaGuardar);
    }

    // Devolvemos el evento completo con lo que acabamos de persistir
    return this.eventRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['eventomenus', 'eventobebidas'],
    });
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

    // MODIFICACIÓN: Contemplar la regla de salteo en update si cambia de estado o se mantiene pendiente
    const estadoActual = updateEventDto.estado || event.estado;
    const invitadosActuales = updateEventDto.cant_invitados !== undefined ? updateEventDto.cant_invitados : event.cant_invitados;
    const esPendienteVacioUpdate = estadoActual === 'pendiente' && (invitadosActuales === 0 || !invitadosActuales);

    if (updateEventDto.cant_invitados && !esPendienteVacioUpdate) {
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

    return this.eventRepository.remove(event);
  }
}