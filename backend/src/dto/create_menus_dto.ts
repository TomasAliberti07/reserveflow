import { IsString, IsNumber, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateMenusDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoria!: string;

  @IsString()
  @IsOptional()
  descripcion?: string | null;

  @IsString()
  @IsOptional() // <-- IMPORTANTE: Agrégalo para que no falle si viene vacío
  plaprincipal?: string | null;

  @IsString()
  @IsOptional() // <-- IMPORTANTE: Agrégalo también aquí
  postre?: string | null;

  @IsString()
  @IsNotEmpty()
  precio!: string;

  @IsInt() // Si el frontend envía un número, esto está bien. 
  @IsOptional() // Opcional por si el default lo pone la DB
  disponible!: number;

  @IsString()
  @IsOptional()
  dieta_especifica?: string | null;
}