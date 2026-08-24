import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export interface UserProfileDTO {
  id: number;
  nombre: string;
  apellido?: string;
  telefono?: string;
  email: string;
}

export interface UpdateProfileDTO {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
}

export interface ChangePasswordDTO {
  passwordActual: string;
  passwordNueva: string;
}

// Instancia Axios con interceptor de token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Registro de usuario
export const registerUser = async (userData: any) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// Obtener perfil
export const getUserProfile = async (): Promise<UserProfileDTO> => {
  const response = await api.get<UserProfileDTO>("/profile");
  return response.data;
};

// Actualizar perfil
export const updateUserProfile = async (
  data: UpdateProfileDTO
): Promise<UserProfileDTO> => {
  const response = await api.patch<UserProfileDTO>("/profile", data);
  return response.data;
};

// Cambiar contraseña
export const changePassword = async (
  data: ChangePasswordDTO
): Promise<{ message: string }> => {
  const response = await api.patch<{ message: string }>("/change-password", data);
  return response.data;
};