import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsEmail, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
}

// 1. DTO auxiliar para validar la estructura de cada bebida en el array
class BebidaSeleccionadaDto {
  @IsNumber()
  bebida_id!: number;

  @IsNumber()
  cant!: number;
}

// 2. DTO auxiliar para validar la estructura de cada menú en el array
class MenuSeleccionadoDto {
  @IsNumber()
  menu_id!: number;

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

  @IsNumber()
  @IsOptional()
  cant_invitados?: number;

  @IsDateString()
  comienzo!: string | Date;

  @IsDateString()
  finaliza!: string | Date;

  @IsEnum(EventEstado)
  @IsOptional()
  estado?: EventEstado;

  @IsString()
  @IsOptional()
  notas?: string;


  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuSeleccionadoDto)
  menus?: MenuSeleccionadoDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BebidaSeleccionadaDto)
  bebidas?: BebidaSeleccionadaDto[];
}