import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Usamos async para esperar el impacto real en la DB
  async create(createBebidaDto: CreateBebidaDto): Promise<Bebida> {
    // console.log('Recibiendo en Service:', createBebidaDto);
    
    const nuevaBebida = this.bebidaRepository.create(createBebidaDto);
    
    // El await asegura que el registro se guarde antes de continuar
    return await this.bebidaRepository.save(nuevaBebida);
  }

  async findAll(): Promise<Bebida[]> {
    return await this.bebidaRepository.find();
  }

  async findOne(id: number): Promise<Bebida> {
    const bebida = await this.bebidaRepository.findOne({ where: { id } });
    if (!bebida) throw new NotFoundException(`La bebida con ID ${id} no existe`);
    return bebida;
  }

  // Cambiamos .update() por .preload() + .save() para que devuelva el objeto real
 async update(id: number, updateBebidaDto: UpdateBebidaDto): Promise<Bebida> {
    // Usamos desestructuración para separar el 'id' que viene en el cuerpo
    // del resto de los datos (nombre, precio, stock, etc.)
    const { id: _, ...datosAActualizar } = updateBebidaDto;

    const bebida = await this.bebidaRepository.preload({
      id: id,                // El ID que viene del @Param (la URL)
      ...datosAActualizar,   // El resto de los campos opcionales
    });

    if (!bebida) {
      throw new NotFoundException(`No se encontró la bebida con ID ${id}`);
    }

    return await this.bebidaRepository.save(bebida);
  }

  async delete(id: number): Promise<void> {
    const resultado = await this.bebidaRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`No se pudo eliminar: ID ${id} no encontrado`);
    }
  }
}