import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; // Corrección del import aquí
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido, EstadoPedido } from './pedidos.entity';
import { PedidoItem } from './pedido-item.entity';
import { CreatePedidoDto } from '../dto/create_pedido_dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const { proveedorId, items } = createPedidoDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('El pedido debe contener al menos un ítem.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nuevoPedido = queryRunner.manager.create(Pedido, {
        proveedor: { id: proveedorId },
        estado: EstadoPedido.PENDIENTE,
      });
      const pedidoGuardado = await queryRunner.manager.save(nuevoPedido);

      const renglones = items.map((item) => {
        return queryRunner.manager.create(PedidoItem, {
          pedido: pedidoGuardado,
          cantidad: item.cantidad,
          bebidaId: item.bebidaId || undefined,
          menu: item.menuId ? { id: item.menuId } : undefined,
        });
      });
      await queryRunner.manager.save(PedidoItem, renglones);

      await queryRunner.commitTransaction();
      
      return await this.findOne(pedidoGuardado.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al procesar el pedido: ${mensaje}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Pedido[]> {
    return await this.pedidoRepository.find({
      relations: ['items', 'proveedor'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['items', 'proveedor'],
    });
    
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async updateEstado(id: string, estado: EstadoPedido): Promise<Pedido> {
    const pedido = await this.findOne(id);
    pedido.estado = estado;
    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: string): Promise<{ message: string }> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);
    return { message: `Pedido con ID ${id} eliminado correctamente` };
  }
}