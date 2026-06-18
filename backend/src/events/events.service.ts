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
    const events = await this.eventRepository.find({ 
      relations: ['salon', 'eventomenus', 'eventomenus.menu', 'eventobebidas', 'eventobebidas.bebida'] 
    });

    const now = new Date();
    const eventsToCancel = events.filter(
      (event) => event.estado === 'pendiente' && event.finaliza && new Date(event.finaliza) < now,
    );

    if (eventsToCancel.length > 0) {
      const updatedEvents = await Promise.all(
        eventsToCancel.map(async (event) => {
          event.estado = 'cancelado';
          return this.eventRepository.save(event);
        }),
      );
      return events.map(
        (event) => updatedEvents.find((updated) => updated.id === event.id) ?? event,
      );
    }

    return events;
  }

  async create(createEventDto: CreateEventDto, userId: number) {
    const salon = await this.salonRepository.findOne({
      where: { id: createEventDto.salon_id },
    });

    if (!salon || !salon.estado) {
      throw new BadRequestException('Salón no disponible');
    }

    const comienzoFecha = new Date(createEventDto.comienzo);
    if (createEventDto.comienzo && comienzoFecha < new Date()) {
      throw new BadRequestException('No se puede cargar un evento con fecha anterior');
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

    // 1. Creamos el objeto asignando explícitamente el users_id que agregamos a la entidad
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
      salon_id: createEventDto.salon_id,
      users_id: userId, // 🚀 CORREGIDO: Mapeo de columna nativa directa
    });

    const savedEvent = await this.eventRepository.save(newEvent);

    // 2. Procesamos el array 'menus' de múltiples opciones, mapeando con la entidad intermedia
    if (createEventDto.menus && createEventDto.menus.length > 0) {
      const menusParaGuardar = createEventDto.menus.map((m) => 
        this.eventomenusRepository.create({
          evento_id: savedEvent.id,
          menu_id: m.menu_id,
          cantidad: m.cant || createEventDto.cant_invitados || 1,
        })
      );
      await this.eventomenusRepository.save(menusParaGuardar);
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

    // Devolvemos el evento completo con lo que acabamos de persistir de forma consistente
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

      if (updateEventDto.comienzo && comienzo < new Date()) {
        throw new BadRequestException('No se puede actualizar un evento hacia una fecha anterior');
      }

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

    event.estado = 'cancelado';
    await this.eventRepository.save(event);

    return { message: 'Evento eliminado correctamente' };
  }
}