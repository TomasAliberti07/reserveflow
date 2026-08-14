import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt_auth_guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics() {
    return this.dashboardService.getMetrics();
  }

  @Get('resumen')
  async getResumen() {
    return this.dashboardService.getResumenGeneral();
  }

  @Get('salones/stats')
  async getSalonesStats() {
    return this.dashboardService.getSalonesStats();
  }

  @Get('eventos/stats')
  async getEventosStats() {
    return this.dashboardService.getEventosStats();
  }

  @Get('eventos/proximos')
  async getProximos7Eventos() {
    return this.dashboardService.getProximos7Eventos();
  }

  @Get('eventos/hoy')
  async getEventosHoy() {
    return this.dashboardService.getEventosHoy();
  }

  @Get('pedidos/stats')
  async getPedidosStats() {
    return this.dashboardService.getPedidosStats();
  }

  @Get('pedidos/pendientes')
  async getPedidosPendientes() {
    return this.dashboardService.getPedidosPendientes();
  }

  @Get('actividad')
  async getActividadReciente() {
    return this.dashboardService.getActividadReciente();
  }
}