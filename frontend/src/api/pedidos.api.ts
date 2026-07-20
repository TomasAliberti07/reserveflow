import axios from "axios";

const API_URL = "http://localhost:3000";

// --- INTERFACES ---

export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO';

export interface PedidoItem {
  id: string;
  cantidad: number;
  bebidaId?: number | null;
  menuId?: number | null;
}

export interface Pedido {
  id: string;
  estado: EstadoPedido;
  fechaCreacion: string;
  proveedor: {
    id: number;
    nombre: string;
  };
  items: PedidoItem[];
}

export interface CreatePedidoItemDto {
  cantidad: number;
  bebidaId?: number;
  menuId?: number;
}

export interface CreatePedidoDto {
  proveedorId: number;
  items: CreatePedidoItemDto[];
}

// --- AUXILIARES ---

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- PETICIONES ---

export const getPedidos = async (): Promise<Pedido[]> => {
  const response = await axios.get<Pedido[]>(`${API_URL}/pedidos`, getAuthHeaders());
  return response.data;
};

export const getPedidoById = async (id: string): Promise<Pedido> => {
  const response = await axios.get<Pedido>(`${API_URL}/pedidos/${id}`, getAuthHeaders());
  return response.data;
};

export const createPedido = async (pedido: CreatePedidoDto): Promise<Pedido> => {
  const response = await axios.post<Pedido>(`${API_URL}/pedidos`, pedido, getAuthHeaders());
  return response.data;
};

export const updateEstadoPedido = async (id: string, estado: EstadoPedido): Promise<Pedido> => {
  const response = await axios.patch<Pedido>(
    `${API_URL}/pedidos/${id}/estado`, 
    { estado }, 
    getAuthHeaders()
  );
  return response.data;
};

export const deletePedido = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/pedidos/${id}`, getAuthHeaders());
};