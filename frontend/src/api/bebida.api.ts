import axios from "axios";

const API_URL = "http://localhost:3000";

export interface BebidaDTO {
  id?: number;
  nombre: string;
  alcohol: number;
  precio: string;
  stock: number;
}

export const getBebidas = async (): Promise<BebidaDTO[]> => {
  const response = await axios.get<BebidaDTO[]>(`${API_URL}/bebida`);
  return response.data;
};

export const getBebidaById = async (id: number) => {
  const response = await axios.get(`${API_URL}/bebida/${id}`);
  return response.data;
};

export const createBebida = async (data: Partial<BebidaDTO>): Promise<BebidaDTO> => {
  const response = await axios.post<BebidaDTO>(`${API_URL}/bebida`, data);
  return response.data;
};

export const updateBebida = async (id: number, data: Partial<BebidaDTO>) => {
  const response = await axios.put(`${API_URL}/bebida/${id}`, data);
  return response.data;
};

export const deleteBebida = async (id: number) => {
  const response = await axios.delete(`${API_URL}/bebida/${id}`);
  return response.data;
};
