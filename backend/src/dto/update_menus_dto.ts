import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class UpdateMenusDto {
  @IsOptional()
  @IsString()
  entrada?: string;

  @IsOptional()
  @IsString()
  plato_principal?: string;

  @IsOptional()
  @IsString()
  postre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  precio?: number;

  @IsOptional()
  @IsInt()
  disponible?: number;
}
