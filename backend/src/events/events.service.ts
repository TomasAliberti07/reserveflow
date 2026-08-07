import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm'; 
import { Event } from './events.entity';
import { Salones } from '../salons/salons.entity';
import { Eventomenus } from './eventomenus.entity';
import { Eventobebida } from './eventobebida.entity';
import { Bebida } from '../bebida/bebida.entity';
import { CreateEventDto, EventEstado } from '../dto/create_events_dto';
import { UpdateEventDto } from '../dto/update_events_dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly dataSource: DataSource, 

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(Salones)
    private salonRepository: Repository<Salones>,

    @InjectRepository(Eventomenus)
    private eventomenusRepository: Repository<Eventomenus>,

    @InjectRepository(Eventobebida)
    private eventobebidaRepository: Repository<Eventobebida>,

    @InjectRepository(Bebida)
    private bebidaRepository: Repository<Bebida>,
  ) {}

  async findAll() {
    const events = await this.eventRepository.find({ 
      relations: ['salon', 'eventomenus', 'eventomenus.menu', 'eventobebidas', 'eventobebidas.bebida'] 
    });

    const now = new Date();

    // 1. Eventos pendientes pasados de fecha -> pasan a cancelado
    const eventsToCancel = events.filter(
      (event) => event.estado === EventEstado.PENDIENTE && event.finaliza && new Date(event.finaliza) < now,
    );

    // 2. Eventos confirmados pasados de fecha -> pasan a finalizado
    const eventsToFinalize = events.filter(
      (event) => event.estado === EventEstado.CONFIRMADO && event.finaliza && new Date(event.finaliza) < now,
    );

    const updatesToSave: Event[] = [];

    eventsToCancel.forEach((event) => {
      event.estado = EventEstado.CANCELADO;
      updatesToSave.push(event);
    });

    eventsToFinalize.forEach((event) => {
      event.estado = EventEstado.FINALIZADO;
      updatesToSave.push(event);
    });

    if (updatesToSave.length > 0) {
      const updatedEvents = await this.eventRepository.save(updatesToSave);

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

    // Validación de horarios (excluye tanto cancelados como finalizados)
    const overlappingEvent = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.salon_id = :salonId', { salonId: salon.id })
      .andWhere('event.estado NOT IN (:...estadosInactivos)', {
        estadosInactivos: [EventEstado.CANCELADO, EventEstado.FINALIZADO],
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

    const estadoEvento = createEventDto.estado ?? EventEstado.PENDIENTE;
    const esPendienteVacio = estadoEvento === EventEstado.PENDIENTE && (!createEventDto.cant_invitados || createEventDto.cant_invitados === 0);
    
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

    return await this.dataSource.transaction(async (manager) => {
      const newEvent = manager.create(Event, {
        cliente_nombre: createEventDto.cliente_nombre,
        cliente_apellido: createEventDto.cliente_apellido,
        cliente_email: createEventDto.cliente_email,
        cliente_numero: createEventDto.cliente_numero,
        cant_invitados: createEventDto.cant_invitados || 0,
        comienzo: createEventDto.comienzo,
        finaliza: createEventDto.finaliza,
        estado: estadoEvento,
        notas: createEventDto.notas,
        salon_id: createEventDto.salon_id,
        users_id: userId,
      });

      const savedEvent = await manager.save(newEvent);

      if (createEventDto.menus && createEventDto.menus.length > 0) {
        const menusParaGuardar = createEventDto.menus.map((m) => 
          manager.create(Eventomenus, {
            evento_id: savedEvent.id,
            menu_id: m.menu_id,
            cantidad: m.cant || createEventDto.cant_invitados || 1,
          })
        );
        await manager.save(menusParaGuardar);
      }

      if (createEventDto.bebidas && createEventDto.bebidas.length > 0) {
        for (const b of createEventDto.bebidas) {
          const bebida = await manager.findOne(Bebida, { where: { id: b.bebida_id } });

          if (!bebida) {
            throw new NotFoundException(`La bebida con ID ${b.bebida_id} no existe`);
          }

          if (bebida.stock > 0) {
            if (bebida.stock < b.cant) {
              throw new BadRequestException(
                `Stock insuficiente para la bebida "${bebida.nombre}". Disponible: ${bebida.stock}, Solicitado: ${b.cant}`
              );
            }
            bebida.stock -= b.cant;
            await manager.save(bebida);
          }

          const nuevaEventobebida = manager.create(Eventobebida, {
            evento_id: savedEvent.id,
            bebida_id: b.bebida_id,
            cant: b.cant,
          });
          await manager.save(nuevaEventobebida);
        }
      }

      return manager.findOne(Event, {
        where: { id: savedEvent.id },
        relations: ['eventomenus', 'eventobebidas'],
      });
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

    const estadoActual = updateEventDto.estado || event.estado;

    // 1. Validación para cuando se fuerza manualmente el estado a FINALIZADO
    if (updateEventDto.estado === EventEstado.FINALIZADO) {
      const fechaFinaliza = new Date(event.finaliza);
      if (fechaFinaliza > new Date()) {
        throw new BadRequestException(
          'No se puede marcar como finalizado un evento que aún no ha concluido.',
        );
      }
    }

    // 2. Validación de solapamiento si se cambia de salón
    if (updateEventDto.salon_id && updateEventDto.salon_id !== event.salon.id) {
      const newSalon = await this.salonRepository.findOne({
        where: { id: updateEventDto.salon_id },
      });

      if (!newSalon || !newSalon.estado) {
        throw new BadRequestException('Salón no disponible');
      }

      const overlappingEvent = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.id != :eventId', { eventId: id })
        .andWhere('event.salon_id = :salonId', { salonId: newSalon.id })
        .andWhere('event.estado NOT IN (:...estadosInactivos)', {
          estadosInactivos: [EventEstado.CANCELADO, EventEstado.FINALIZADO],
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

    // 3. Validación de rango de invitados
    const invitadosActuales = updateEventDto.cant_invitados !== undefined ? updateEventDto.cant_invitados : event.cant_invitados;
    const esPendienteVacioUpdate = estadoActual === EventEstado.PENDIENTE && (invitadosActuales === 0 || !invitadosActuales);

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

    // 4. Validación de fechas
    if (updateEventDto.comienzo || updateEventDto.finaliza) {
      if (updateEventDto.comienzo) {
        const comienzoNuevo = new Date(updateEventDto.comienzo);
        const comienzoOriginal = new Date(event.comienzo);

        // Si la fecha enviada es distinta a la original Y es menor a la actual -> Rebotar
        if (comienzoNuevo.getTime() !== comienzoOriginal.getTime() && comienzoNuevo < new Date()) {
          throw new BadRequestException('No se puede reprogramar un evento hacia una fecha anterior');
        }
      }

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

    event.estado = EventEstado.CANCELADO;
    await this.eventRepository.save(event);

    return { message: 'Evento eliminado correctamente' };
  }
}