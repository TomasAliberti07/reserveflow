import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Proveedor } from '../proveedores/proveedor.entity'; 
import { PedidoItem } from './pedido-item.entity';

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE,
  })
  estado!: EstadoPedido;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @ManyToOne(() => Proveedor, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor!: Proveedor;

  @OneToMany(() => PedidoItem, (item) => item.pedido, { cascade: true })
  items!: PedidoItem[];
}