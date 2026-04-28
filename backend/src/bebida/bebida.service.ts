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
      order: { nombre: 'ASC' }     
    });
  }

 
  async findOne(id: number, userId: number): Promise<Bebida> {
    const bebida = await this.bebidaRepository.findOne({ 
      where: { id, users_id: userId } 
    });

    if (!bebida) {
      throw new NotFoundException(`La bebida con ID ${id} no existe en su inventario`);
    }
    return bebida;
  }


  async update(id: number, updateBebidaDto: UpdateBebidaDto, userId: number): Promise<Bebida> {
    
    const bebidaExistente = await this.findOne(id, userId);

    
    const bebidaEditada = this.bebidaRepository.merge(bebidaExistente, updateBebidaDto);

    return await this.bebidaRepository.save(bebidaEditada);
  }

  
  async delete(id: number, userId: number): Promise<void> {
    // Usamos findOne para validar existencia y propiedad antes de borrar
    const bebida = await this.findOne(id, userId);
    await this.bebidaRepository.remove(bebida);
  }
}