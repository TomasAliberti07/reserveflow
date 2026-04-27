import { IsString, IsInt, Min, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBebidaDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @Matches(/^[a-záéíóúñ\s]*$/, { message: 'El nombre solo puede contener letras' })
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  nombre?: string;

  @IsOptional()
  @IsInt({ message: 'El alcohol debe ser 0 o 1' })
  alcohol?: number;

  @IsOptional()
  @IsString({ message: 'El precio debe ser texto' })
  precio?: string;

  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;
}
