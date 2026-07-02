import { IsString, IsNumber, IsNotEmpty, IsInt, Min, Matches, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBebidaDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Matches(/^[a-záéíóúñ\s]*$/, { message: 'El nombre solo puede contener letras' })
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value)
  nombre!: string;

  @IsInt({ message: 'El alcohol debe ser 0 o 1' })
  alcohol!: number;

  @IsString({ message: 'El precio debe ser texto' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  precio!: string;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock!: number;


  @IsInt({ message: 'El ID del proveedor debe ser un número entero' })
  @Min(1, { message: 'El ID del proveedor debe ser un ID válido' })
  @IsOptional()
  proveedor_id?: number;
}