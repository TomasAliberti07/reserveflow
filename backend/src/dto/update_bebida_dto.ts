import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateBebidaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsInt()
  alcohol?: number;

  @IsOptional()
  @IsString()
  precio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}