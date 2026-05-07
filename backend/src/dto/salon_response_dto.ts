import { Expose } from 'class-transformer';

export class SalonResponseDto {
  @Expose()
  id!: number;

  @Expose()
  nombre!: string;

  @Expose()
  localizacion!: string;

  @Expose()
  mincapacidad!: number;

  @Expose()
  maxcapacidad!: number;

  @Expose()
  estado!: number;

  @Expose()
  creacion!: Date;

  @Expose()
  actualizacion!: Date;
}