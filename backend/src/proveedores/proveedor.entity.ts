import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Bebida } from '../bebida/bebida.entity'; 
import { Menus } from '../menus/menus.entity';  

export enum TipoProveedor {
  BEBIDA = 'BEBIDA',
  MENU = 'MENU',
}

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  rubro!: string;

  @Column()
  cel!: string;

  @Column({
    type: 'enum',
    enum: TipoProveedor,
  })
  tipo!: TipoProveedor;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // --- Relaciones inversas (OneToMany) ---
  @OneToMany(() => Bebida, (bebida) => bebida.proveedor)
  bebidas!: Bebida[];

  @OneToMany(() => Menus, (menus) => menus.proveedor)
  menus!: Menus[];
}