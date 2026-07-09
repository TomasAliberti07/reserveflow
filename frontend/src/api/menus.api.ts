import axios from "axios";

const API_URL = "http://localhost:3000";

export interface MenusDTO {
  id?: number;
  nombre: string;
  categoria?: string;
  plaprincipal?: string | null;
  postre?: string | null;
  descripcion?: string | null;
  dieta_especifica?: string | null;
  precio: string;
  disponible: number;
  createdAt?: string;
  updatedAt?: string;
  
 
  proveedorId?: number | null; 
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

export const getMenus = async (): Promise<MenusDTO[]> => {
  const response = await axios.get<MenusDTO[]>(`${API_URL}/menus`, getAuthHeaders());
  return response.data;
};

export const createMenu = async (data: Partial<MenusDTO>): Promise<MenusDTO> => {
  const response = await axios.post<MenusDTO>(`${API_URL}/menus`, data, getAuthHeaders());
  return response.data;
};

export const updateMenu = async (id: number, data: Partial<MenusDTO>) => {
  const response = await axios.put(`${API_URL}/menus/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteMenu = async (id: number) => {
  const response = await axios.delete(`${API_URL}/menus/${id}`, getAuthHeaders());
  return response.data;
};