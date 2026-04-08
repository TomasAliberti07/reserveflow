import { IsString, IsNumber, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateMenusDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion!: string;

  @IsString()
  precio!: string;

  @IsInt()
  disponible!: number;
}
