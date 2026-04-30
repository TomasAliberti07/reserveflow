import axios from "axios";

const API_URL = "http://localhost:3000";

export interface SalonsDTO {
  id?: number;
  nombre: string;
  localizacion: string;
  mincapacidad: number;
  maxcapacidad: number;
  estado: number;
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

export const getSalons = async (): Promise<SalonsDTO[]> => {
  const response = await axios.get<SalonsDTO[]>(
    `${API_URL}/salons`,
    getAuthHeaders()
  );
  return response.data;
};

export const getSalonById = async (id: number) => {
  const response = await axios.get(
    `${API_URL}/salons/${id}`,
    getAuthHeaders()
  );
  return response.data;
};

export const createSalon = async (
  data: Partial<SalonsDTO>
): Promise<SalonsDTO> => {
  const response = await axios.post<SalonsDTO>(
    `${API_URL}/salons`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const updateSalon = async (id: number, data: Partial<SalonsDTO>) => {
  const response = await axios.put(
    `${API_URL}/salons/${id}`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteSalon = async (id: number) => {
  const response = await axios.delete(
    `${API_URL}/salons/${id}`,
    getAuthHeaders()
  );
  return response.data;
};
