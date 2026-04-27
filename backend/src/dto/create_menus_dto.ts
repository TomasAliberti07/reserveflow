import { IsString, IsNumber, IsNotEmpty, IsInt, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMenusDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Matches(/^[a-záéíóúñ\s]*$/, { message: 'El nombre solo puede contener letras' })
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  nombre!: string;

  @IsString({ message: 'La categoría debe ser texto' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoria!: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  descripcion?: string | null;

  @IsString()
  @IsOptional()
  plaprincipal?: string | null;

  @IsString()
  @IsOptional()
  postre?: string | null;

  @IsString({ message: 'El precio debe ser texto' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  precio!: string;

  @IsInt({ message: 'Disponible debe ser 0 o 1' })
  @IsOptional()
  disponible!: number;

  @IsString({ message: 'La dieta especial debe ser texto' })
  @IsOptional()
  dieta_especifica?: string | null;
}
