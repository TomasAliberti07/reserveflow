import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Proveedor } from '../proveedores/proveedor.entity'; 

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

  // Mapeamos la columna física para poder usarla directamente si es necesario
  @Column({ name: 'proveedor_id', type: 'int', nullable: true })
  proveedor_id!: number | null;

  @Column({ name: 'users_id' })
  users_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'users_id' })
  user!: User;


  @ManyToOne(() => Proveedor, (proveedor) => proveedor.bebidas, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor!: Proveedor | null;

  @CreateDateColumn({ type: 'datetime' })
  creacion!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  actualizacion!: Date;
}