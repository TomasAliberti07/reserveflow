import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { CreateProveedorDto } from '../dto/create_proveedor_dto';
import { UpdateProveedorDto } from '../dto/update_proveedor_dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const nuevoProveedor = this.proveedorRepository.create(createProveedorDto);
    return await this.proveedorRepository.save(nuevoProveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return await this.proveedorRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({ where: { id } });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    const proveedorEditado = this.proveedorRepository.merge(proveedor, updateProveedorDto);
    return await this.proveedorRepository.save(proveedorEditado);
  }

  async remove(id: number): Promise<{ message: string }> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
    return { message: `Proveedor con ID ${id} eliminado correctamente` };
  }
}