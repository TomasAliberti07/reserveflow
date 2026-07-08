import axios from "axios";

const API_URL = "http://localhost:3000";

export interface Proveedor {
  id: number;
  nombre: string;
  rubro?: string;
  cel: string;
  tipo: 'BEBIDA' | 'MENU';
}

export interface CreateProveedorDto {
  nombre: string;
  rubro?: string;
  cel: string;
  tipo: 'BEBIDA' | 'MENU';
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

export const getProveedores = async (): Promise<Proveedor[]> => {
  const response = await axios.get<Proveedor[]>(`${API_URL}/proveedores`, getAuthHeaders());
  return response.data;
};

export const getProveedorById = async (id: number): Promise<Proveedor> => {
  const response = await axios.get<Proveedor>(`${API_URL}/proveedores/${id}`, getAuthHeaders());
  return response.data;
};

export const createProveedor = async (proveedor: CreateProveedorDto): Promise<Proveedor> => {
  const response = await axios.post<Proveedor>(`${API_URL}/proveedores`, proveedor, getAuthHeaders());
  return response.data;
};


export const updateProveedor = async (id: number, proveedor: Partial<CreateProveedorDto>): Promise<Proveedor> => {
  const response = await axios.patch<Proveedor>(`${API_URL}/proveedores/${id}`, proveedor, getAuthHeaders());
  return response.data;
};

export const deleteProveedor = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/proveedores/${id}`, getAuthHeaders());
};