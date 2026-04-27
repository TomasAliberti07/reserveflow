import { IsString, IsInt, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMenusDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @Matches(/^[a-záéíóúñ\s]*$/, { message: 'El nombre solo puede contener letras' })
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La categoría debe ser texto' })
  categoria?: string;

  @IsOptional()
  @IsString({ message: 'El campo debe ser texto' })
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  plaprincipal?: string | null;

  @IsOptional()
  @IsString({ message: 'El campo debe ser texto' })
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  postre?: string | null;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  descripcion?: string | null;

  @IsOptional()
  @IsString({ message: 'El precio debe ser texto' })
  precio?: string;

  @IsOptional()
  @IsInt({ message: 'Disponible debe ser 0 o 1' })
  disponible?: number;

  @IsOptional()
  @IsString({ message: 'La dieta especial debe ser texto' })
  dieta_especifica?: string | null;
}
