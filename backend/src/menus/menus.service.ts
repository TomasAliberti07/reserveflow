import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menus } from './menus.entity';
import { CreateMenusDto } from '../dto/create_menus_dto';
import { UpdateMenusDto } from '../dto/update_menus_dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menus)
    private menusRepository: Repository<Menus>,
  ) {}

  async create(createMenusDto: CreateMenusDto): Promise<Menus> {
    const nuevoMenu = this.menusRepository.create(createMenusDto);
    return await this.menusRepository.save(nuevoMenu);
  }

  async findAll(): Promise<Menus[]> {
    return await this.menusRepository.find();
  }

  async findOne(id: number): Promise<Menus> {
    const menu = await this.menusRepository.findOne({ where: { id } });
    if (!menu) throw new NotFoundException(`El menú con ID ${id} no existe`);
    return menu;
  }

  async update(id: number, updateMenusDto: UpdateMenusDto): Promise<Menus> {
    const menu = await this.menusRepository.preload({
      id: id,
      ...updateMenusDto,
      precio: updateMenusDto.precio ? String(updateMenusDto.precio) : undefined,
    });

    if (!menu) {
      throw new NotFoundException(`No se encontró el menú con ID ${id}`);
    }

    return await this.menusRepository.save(menu);
  }

  async delete(id: number): Promise<void> {
    const resultado = await this.menusRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`No se pudo eliminar: ID ${id} no encontrado`);
    }
  }
}
