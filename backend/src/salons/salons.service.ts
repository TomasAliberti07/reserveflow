import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salones } from './salons.entity';
import { CreateSalonsDto } from '../dto/create_salons_dto'; 
import { UpdateSalonsDto } from '../dto/update_salons_dto';

@Injectable()
export class SalonsService {
  constructor(
    @InjectRepository(Salones)
    private readonly salonRepository: Repository<Salones>,
  ) {}

  async findAll(userId: number): Promise<Salones[]> {
    return await this.salonRepository.find({
      where: { user: { id: userId } },
      order: { creacion: 'DESC' },
    });
  }

  async findActive(userId: number): Promise<Salones[]> {
    return await this.salonRepository.find({
      where: { 
        estado: true, 
        user: { id: userId } 
      },
      order: { nombre: 'ASC' },
    });
  }


  async create(createSalonDto: CreateSalonsDto, userId: number): Promise<Salones> {
    const nuevoSalon = this.salonRepository.create({
      ...createSalonDto,
      user: { id: userId }, 
    });
    return await this.salonRepository.save(nuevoSalon);
  }

  async findOne(id: number, userId: number): Promise<Salones> {
    const salon = await this.salonRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!salon) {
      throw new NotFoundException(`Salón con ID ${id} no encontrado`);
    }
    return salon;
  }

  
  async update(id: number, updateDto: UpdateSalonsDto, userId: number): Promise<Salones> {
    const salon = await this.findOne(id, userId); // Valida existencia y dueño
    const actualizado = this.salonRepository.merge(salon, updateDto);
    return await this.salonRepository.save(actualizado);
  }

  
  async remove(id: number, userId: number): Promise<Salones> {
    const salon = await this.findOne(id, userId);
    salon.estado = false;
    return await this.salonRepository.save(salon);
  }
}