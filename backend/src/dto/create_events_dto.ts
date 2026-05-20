import { IsString, IsNumber, IsDateString, IsEnum, IsOptional, IsEmail } from 'class-validator';

export enum EventEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
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
  cant_invitados!: number;

  @IsDateString()
  comienzo!: string | Date;

  @IsDateString()
  finaliza!: string | Date;

  @IsEnum(EventEstado)
  estado!: EventEstado;

  @IsString()
  @IsOptional()
  notas?: string;
}
