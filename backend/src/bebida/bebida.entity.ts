import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bebida')
export class Bebida {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'tinyint', width: 1 })
  alcohol!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio!: string;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @CreateDateColumn({ type: 'datetime' })
  creacion!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  actualizacion!: Date;
}
