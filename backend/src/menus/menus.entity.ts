import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Proveedor } from '../proveedores/proveedor.entity'; // Asegurá esta ruta según tu árbol

@Entity('menus')
export class Menus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  categoria!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  plaprincipal!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  postre!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio!: string;

  @Column({ type: 'tinyint', width: 1 })
  disponible!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  dieta_especifica!: string | null;

  // Mapeamos la columna física de la FK para MySQL
  @Column({ name: 'proveedor_id', type: 'int', nullable: true })
  proveedor_id!: number | null;

  @Column({ name: 'users_id' })
  users_id!: number;
 
  @ManyToOne(() => User)
  @JoinColumn({ name: 'users_id' })
  user!: User;

  // NUEVO: Relación ManyToOne con Proveedor
  @ManyToOne(() => Proveedor, (proveedor) => proveedor.menus, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor!: Proveedor | null;

  @CreateDateColumn({ 
    name: 'creacion', 
    type: 'datetime' 
  })
  createdAt!: Date; 

  @UpdateDateColumn({ 
    name: 'actualizacion', 
    type: 'datetime' 
  })
  updatedAt!: Date; 
}