import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class UpdateMenusDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  plaprincipal?: string | null;

  @IsOptional()
  @IsString()
  postre?: string | null;

  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @IsOptional()
  @IsString()
  precio?: string;

  @IsOptional()
  @IsInt()
  disponible?: number;
}
