import axios from "axios";

const API_URL = "http://localhost:3000";

export interface EventoDTO {
  id?: number;
  salon_id: number;
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_email: string;
  cliente_numero: string;
  cant_invitados: number;
  comienzo: string;
  finaliza: string;
  estado?: "pendiente" | "confirmado" | "finalizado" | "cancelado";
  notas?: string;
  // Agregamos las relaciones opcionales para la creación/edición de menús y bebidas
  menus?: Array<{ menu_id: number; cant: number }>;
  bebidas?: Array<{ bebida_id: number; cant: number }>;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- PETICIONES ---

export const getEvents = async (): Promise<EventoDTO[]> => {
  const response = await axios.get<EventoDTO[]>(
    `${API_URL}/events`,
    getAuthHeaders()
  );
  return response.data;
};

export const createEvent = async (
  data: EventoDTO
): Promise<EventoDTO> => {
  const response = await axios.post<EventoDTO>(
    `${API_URL}/events`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const updateEvent = async (
  id: number,
  data: Partial<EventoDTO>
): Promise<EventoDTO> => {
  const response = await axios.patch<EventoDTO>(
    `${API_URL}/events/${id}`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteEvent = async (id: number) => {
  const response = await axios.delete(
    `${API_URL}/events/${id}`,
    getAuthHeaders()
  );
  return response.data;
};