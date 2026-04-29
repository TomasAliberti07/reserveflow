import { IsString, IsNotEmpty, IsInt, IsOptional, Matches, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSalonsDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  // Permitimos letras, tildes, espacios y números por si acaso
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*$/, { message: 'El nombre contiene caracteres no permitidos' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  nombre!: string;

  @IsString({ message: 'La localización debe ser texto' })
  @IsNotEmpty({ message: 'La localización es obligatoria' })
  @Transform(({ value }) => value?.trim())
  localizacion!: string;

  @Transform(({ value }) => Number(value)) // Convertimos a número antes de validar
  @IsInt({ message: 'La capacidad mínima debe ser un número entero' })
  @Min(1, { message: 'La capacidad debe ser al menos 1' })
  mincapacidad!: number;

  @Transform(({ value }) => Number(value)) // Convertimos a número antes de validar
  @IsInt({ message: 'La capacidad máxima debe ser un número entero' })
  maxcapacidad!: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) 
  estado?: boolean;
}