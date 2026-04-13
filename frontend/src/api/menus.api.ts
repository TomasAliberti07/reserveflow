import axios from "axios";

const API_URL = "http://localhost:3000";

export interface MenusDTO {
  id?: number;
  nombre: string;
  plaprincipal?: string | null;
  postre?: string | null;
  descripcion?: string | null;
  precio: string;
  disponible: number;
  createdAt?: string;
  updatedAt?: string;
}

// Usamos el mismo patrón que en bebidas: URL base + /recurso
export const getMenus = async (): Promise<MenusDTO[]> => {
  const response = await axios.get<MenusDTO[]>(`${API_URL}/menus`);
  return response.data;
};

export const createMenu = async (data: Partial<MenusDTO>): Promise<MenusDTO> => {
  const response = await axios.post<MenusDTO>(`${API_URL}/menus`, data);
  return response.data;
};

export const updateMenu = async (id: number, data: Partial<MenusDTO>) => {
  const response = await axios.put(`${API_URL}/menus/${id}`, data);
  return response.data;
};

export const deleteMenu = async (id: number) => {
  const response = await axios.delete(`${API_URL}/menus/${id}`);
  return response.data;
};