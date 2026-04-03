import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateMenusDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  precio?: string;

  @IsOptional()
  @IsInt()
  disponible?: number;
}
