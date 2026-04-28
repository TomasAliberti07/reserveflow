import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
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

 @Column({ name: 'users_id' })
   users_id!: number;
 
   @ManyToOne(() => User)
   @JoinColumn({ name: 'users_id' })
   user!: User;

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
