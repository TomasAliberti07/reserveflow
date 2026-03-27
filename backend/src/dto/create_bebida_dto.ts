import { IsString, IsNumber, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateBebidaDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsInt() // Porque enviamos 0 o 1
  alcohol: number;

  @IsString() // Porque lo manejamos como string para el decimal de la DB
  precio: string;

  @IsInt()
  @Min(0)
  stock: number;
}