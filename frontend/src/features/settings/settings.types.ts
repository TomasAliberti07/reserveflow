export interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}