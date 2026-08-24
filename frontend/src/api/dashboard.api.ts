import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --- INTERFACES/DTOs ---

export interface MetricasDTO {
  totalSalones: number;
  proximosEventos: number;
  eventosProximos7Dias: number;
  pedidosPendientes: number;
}

export interface SalonesStatsDTO {
  totalSalones: number;
  salonesActivos: number;
  salonesInactivos: number;
  capacidadPromedio: number;
}

export interface EventosStatsDTO {
  totalEventos: number;
  eventosPendientes: number;
  eventosConfirmados: number;
  eventosFinalizados: number;
  eventosCancelados: number;
  eventosHoy: number;
  eventosProximos7Dias: number;
}

export interface EventoResumenDTO {
  id: number;
  cliente: string;
  salon: string;
  comienzo: string;
  finaliza: string;
  invitados: number;
  estado: string;
}

export interface PedidosStatsDTO {
  totalPedidos: number;
  pedidosPendientes: number;
  pedidosConfirmados: number;
  pedidosEntregados: number;
  pedidosCancelados: number;
}

export interface PedidoResumenDTO {
  id: string;
  proveedor: string;
  estado: string;
  fechaCreacion: string;
  cantidadItems: number;
}

export interface ActividadDTO {
  tipo: string;
  titulo: string;
  fecha: string;
  estado: string;
}

export interface ActividadRecienteDTO {
  eventosRecientes: ActividadDTO[];
  pedidosRecientes: ActividadDTO[];
}

export interface ResumenGeneralDTO {
  salones: SalonesStatsDTO;
  eventos: EventosStatsDTO;
  pedidos: PedidosStatsDTO;
}

// --- HEADERS CON AUTENTICACIÓN ---

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- PETICIONES ---

/**
 * Obtiene métricas principales del dashboard
 */
export const getMetricas = async (): Promise<MetricasDTO> => {
  const response = await axios.get<MetricasDTO>(
    `${API_URL}/dashboard/metrics`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene resumen general completo del dashboard
 */
export const getResumenGeneral = async (): Promise<ResumenGeneralDTO> => {
  const response = await axios.get<ResumenGeneralDTO>(
    `${API_URL}/dashboard/resumen`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene estadísticas de salones
 */
export const getSalonesStats = async (): Promise<SalonesStatsDTO> => {
  const response = await axios.get<SalonesStatsDTO>(
    `${API_URL}/dashboard/salones/stats`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene estadísticas de eventos
 */
export const getEventosStats = async (): Promise<EventosStatsDTO> => {
  const response = await axios.get<EventosStatsDTO>(
    `${API_URL}/dashboard/eventos/stats`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene próximos 7 eventos
 */
export const getProximos7Eventos = async (): Promise<EventoResumenDTO[]> => {
  const response = await axios.get<EventoResumenDTO[]>(
    `${API_URL}/dashboard/eventos/proximos`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene eventos de hoy
 */
export const getEventosHoy = async (): Promise<EventoResumenDTO[]> => {
  const response = await axios.get<EventoResumenDTO[]>(
    `${API_URL}/dashboard/eventos/hoy`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene estadísticas de pedidos
 */
export const getPedidosStats = async (): Promise<PedidosStatsDTO> => {
  const response = await axios.get<PedidosStatsDTO>(
    `${API_URL}/dashboard/pedidos/stats`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene pedidos pendientes
 */
export const getPedidosPendientes = async (): Promise<PedidoResumenDTO[]> => {
  const response = await axios.get<PedidoResumenDTO[]>(
    `${API_URL}/dashboard/pedidos/pendientes`,
    getAuthHeaders()
  );
  return response.data;
};

/**
 * Obtiene actividad reciente (últimos 7 días)
 */
export const getActividadReciente = async (): Promise<ActividadRecienteDTO> => {
  const response = await axios.get<ActividadRecienteDTO>(
    `${API_URL}/dashboard/actividad`,
    getAuthHeaders()
  );
  return response.data;
};
