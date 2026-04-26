import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateMenusDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

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

  
  @IsOptional()
  @IsString()
  dieta_especifica?: string | null;
}