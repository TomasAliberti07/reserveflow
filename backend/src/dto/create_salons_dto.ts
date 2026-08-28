import { IsString, IsNotEmpty, IsInt, IsOptional, Matches, Min, IsIn } from 'class-validator';
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
  @Transform(({ value }) => {
    if (value === '1' || value === 1 || value === true || value === 'true') return 1;
    if (value === '0' || value === 0 || value === false || value === 'false') return 0;
    return value;
  })
  @IsInt({ message: 'El estado debe ser un número entero' })
  @IsIn([0, 1], { message: 'El estado debe ser 0 o 1' })
  estado?: number;
}