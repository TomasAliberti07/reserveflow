import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bebida } from './bebida.entity';
import { CreateBebidaDto } from '../dto/create_bebida_dto';
import { UpdateBebidaDto } from '../dto/update_bebida_dto';

@Injectable()
export class BebidaService {
  constructor(
    @InjectRepository(Bebida)
    private bebidaRepository: Repository<Bebida>,
  ) {}

  async create(createBebidaDto: CreateBebidaDto, userId: number): Promise<Bebida> {
    const nuevaBebida = this.bebidaRepository.create({
      ...createBebidaDto,
      users_id: userId, 
    });
    
    return await this.bebidaRepository.save(nuevaBebida);
  }

  async findAll(userId: number): Promise<Bebida[]> {
    return await this.bebidaRepository.find({
      where: { users_id: userId }, 
      relations: ['proveedor'], // Trae el objeto completo del proveedor si tiene uno asignado
      order: { nombre: 'ASC' }     
    });
  }

  async findOne(id: number, userId: number): Promise<Bebida> {
    const bebida = await this.bebidaRepository.findOne({ 
      where: { id, users_id: userId },
      relations: ['proveedor'] // Trae el proveedor para cuando consultes el detalle
    });

    if (!bebida) {
      throw new NotFoundException(`La bebida con ID ${id} no existe en su inventario`);
    }
    return bebida;
  }

  async update(id: number, updateBebidaDto: UpdateBebidaDto, userId: number): Promise<Bebida> {
    // Validamos existencia y pertenencia del usuario primero
    const bebidaExistente = await this.findOne(id, userId);

    // Si desde el frontend nos mandan un proveedor_id en null de forma explícita 
    // (por ejemplo, si desvinculan al proveedor), TypeORM lo va a pisar en null correctamente
    const { proveedor_id, ...datosAEditar } = updateBebidaDto;

    const bebidaEditada = this.bebidaRepository.merge(bebidaExistente, {
      ...datosAEditar,
      proveedor_id: proveedor_id !== undefined ? proveedor_id : bebidaExistente.proveedor_id
    });

    return await this.bebidaRepository.save(bebidaEditada);
  }

  async delete(id: number, userId: number): Promise<void> {
    const bebida = await this.findOne(id, userId);
    await this.bebidaRepository.remove(bebida);
  }
}