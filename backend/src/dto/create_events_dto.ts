import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsEmail, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
}

// 1. DTO auxiliar para validar la estructura de cada bebida que viene en el array
class BebidaSeleccionadaDto {
  @IsNumber()
  bebida_id!: number;

  @IsNumber()
  cant!: number;
}

export class CreateEventDto {
  @IsNumber()
  salon_id!: number;

  @IsString()
  cliente_nombre!: string;

  @IsString()
  cliente_apellido!: string;

  @IsEmail()
  cliente_email!: string;

  @IsString()
  cliente_numero!: string;

  // 2. Cambiado a @IsOptional() para bancar el estado pendiente
  @IsNumber()
  @IsOptional()
  cant_invitados?: number;

  @IsDateString()
  comienzo!: string | Date;

  @IsDateString()
  finaliza!: string | Date;

  @IsEnum(EventEstado)
  estado!: EventEstado;

  @IsString()
  @IsOptional()
  notas?: string;

  // 3. Nuevos campos para la relación con menú (Opcionales)
  @IsNumber()
  @IsOptional()
  menu_id?: number;

  @IsNumber()
  @IsOptional()
  menu_cantidad?: number;

  // 4. Nuevo campo para el listado de bebidas (Opcional)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) // Valida que cada elemento del array cumpla con las reglas de BebidaSeleccionadaDto
  @Type(() => BebidaSeleccionadaDto) // Transforma el JSON plano al tipo DTO
  bebidas?: BebidaSeleccionadaDto[];
}