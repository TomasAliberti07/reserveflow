import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between, LessThanOrEqual } from 'typeorm';
import { Salones } from '../salons/salons.entity'; 
import { Event, EventoEstado } from '../events/events.entity';
import { Pedido, EstadoPedido } from '../pedidos/pedidos.entity'; 

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Salones)
    private readonly salonRepo: Repository<Salones>,
    @InjectRepository(Event)
    private readonly eventoRepo: Repository<Event>,
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
  ) {}

  async getMetrics() {
    const ahora = new Date();
    const enSieteDias = new Date();
    enSieteDias.setDate(ahora.getDate() + 7);

    const totalSalones = await this.salonRepo.count();

    const proximosEventos = await this.eventoRepo.count({
      where: [
        { comienzo: MoreThanOrEqual(ahora), estado: 'confirmado' as EventoEstado },
        { comienzo: MoreThanOrEqual(ahora), estado: 'pendiente' as EventoEstado },
      ],
    });

    const eventosProximos7Dias = await this.eventoRepo.count({
      where: {
        comienzo: Between(ahora, enSieteDias),
      },
    });

    const pedidosPendientes = await this.pedidoRepo.count({
      where: {
        estado: EstadoPedido.PENDIENTE,
      },
    });

    return {
      totalSalones,
      proximosEventos,
      eventosProximos7Dias,
      pedidosPendientes,
    };
  }

  async getSalonesStats() {
    const totalSalones = await this.salonRepo.count();
    const salonesActivos = await this.salonRepo.count({
      where: { estado: 1 },
    });
    const salonesInactivos = totalSalones - salonesActivos;

    const salones = await this.salonRepo.find();
    const capacidadPromedio = salones.length > 0
      ? Math.round(salones.reduce((sum, s) => sum + (s.maxcapacidad || 0), 0) / salones.length)
      : 0;

    return {
      totalSalones,
      salonesActivos,
      salonesInactivos,
      capacidadPromedio,
    };
  }

  async getEventosStats() {
    const ahora = new Date();
    const enSieteDias = new Date();
    enSieteDias.setDate(ahora.getDate() + 7);

    const totalEventos = await this.eventoRepo.count();
    
    const eventosPendientes = await this.eventoRepo.count({
      where: { estado: 'pendiente' as EventoEstado },
    });

    const eventosConfirmados = await this.eventoRepo.count({
      where: { estado: 'confirmado' as EventoEstado },
    });

    const eventosFinalizados = await this.eventoRepo.count({
      where: { estado: 'finalizado' as EventoEstado },
    });

    const eventosCancelados = await this.eventoRepo.count({
      where: { estado: 'cancelado' as EventoEstado },
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const eventosHoy = await this.eventoRepo.count({
      where: {
        comienzo: Between(hoy, manana),
      },
    });

    const eventosProximos7Dias = await this.eventoRepo.count({
      where: {
        comienzo: Between(ahora, enSieteDias),
      },
    });

    return {
      totalEventos,
      eventosPendientes,
      eventosConfirmados,
      eventosFinalizados,
      eventosCancelados,
      eventosHoy,
      eventosProximos7Dias,
    };
  }

  async getPedidosStats() {
    const totalPedidos = await this.pedidoRepo.count();

    const pedidosPendientes = await this.pedidoRepo.count({
      where: { estado: EstadoPedido.PENDIENTE },
    });

    const pedidosConfirmados = await this.pedidoRepo.count({
      where: { estado: EstadoPedido.CONFIRMADO },
    });

    const pedidosEntregados = await this.pedidoRepo.count({
      where: { estado: EstadoPedido.ENTREGADO },
    });

    const pedidosCancelados = await this.pedidoRepo.count({
      where: { estado: EstadoPedido.CANCELADO },
    });

    return {
      totalPedidos,
      pedidosPendientes,
      pedidosConfirmados,
      pedidosEntregados,
      pedidosCancelados,
    };
  }

  async getProximos7Eventos() {
    const ahora = new Date();
    const enSieteDias = new Date();
    enSieteDias.setDate(ahora.getDate() + 7);

    const eventos = await this.eventoRepo.find({
      where: {
        comienzo: Between(ahora, enSieteDias),
      },
      relations: ['salon'],
      order: {
        comienzo: 'ASC',
      },
      take: 7,
    });

    return eventos.map(e => ({
      id: e.id,
      cliente: `${e.cliente_nombre} ${e.cliente_apellido}`,
      salon: e.salon?.nombre || 'N/A',
      comienzo: e.comienzo,
      finaliza: e.finaliza,
      invitados: e.cant_invitados,
      estado: e.estado,
    }));
  }

  async getEventosHoy() {
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const mañana = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);

    const eventos = await this.eventoRepo.find({
      where: {
        comienzo: Between(hoy, mañana),
      },
      relations: ['salon'],
      order: {
        comienzo: 'ASC',
      },
    });

    return eventos.map(e => ({
      id: e.id,
      cliente: `${e.cliente_nombre} ${e.cliente_apellido}`,
      salon: e.salon?.nombre || 'N/A',
      comienzo: e.comienzo,
      finaliza: e.finaliza,
      invitados: e.cant_invitados,
      estado: e.estado,
    }));
  }

  async getPedidosPendientes() {
    const pedidos = await this.pedidoRepo.find({
      where: { estado: EstadoPedido.PENDIENTE },
      relations: ['proveedor', 'items'],
      order: {
        fechaCreacion: 'ASC',
      },
      take: 10,
    });

    return pedidos.map(p => ({
      id: p.id,
      proveedor: p.proveedor?.nombre || 'N/A',
      estado: p.estado,
      fechaCreacion: p.fechaCreacion,
      cantidadItems: p.items?.length || 0,
    }));
  }

  async getResumenGeneral() {
    const salonesStats = await this.getSalonesStats();
    const eventosStats = await this.getEventosStats();
    const pedidosStats = await this.getPedidosStats();

    return {
      salones: salonesStats,
      eventos: eventosStats,
      pedidos: pedidosStats,
    };
  }

  async getActividadReciente() {
    const ahora = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(ahora.getDate() - 7);

    const eventosRecientes = await this.eventoRepo.find({
      where: {
        actualizado: Between(hace7Dias, ahora),
      },
      order: {
        actualizado: 'DESC',
      },
      take: 5,
    });

    const pedidosRecientes = await this.pedidoRepo.find({
      where: {
        fechaCreacion: Between(hace7Dias, ahora),
      },
      relations: ['proveedor'],
      order: {
        fechaCreacion: 'DESC',
      },
      take: 5,
    });

    return {
      eventosRecientes: eventosRecientes.map(e => ({
        tipo: 'evento',
        titulo: `${e.cliente_nombre} ${e.cliente_apellido}`,
        fecha: e.actualizado,
        estado: e.estado,
      })),
      pedidosRecientes: pedidosRecientes.map(p => ({
        tipo: 'pedido',
        titulo: p.proveedor?.nombre || 'Pedido',
        fecha: p.fechaCreacion,
        estado: p.estado,
      })),
    };
  }
}