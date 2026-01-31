import axios from "axios";

const API_URL = "http://localhost:3000";

export const registerUser = async (data: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};
