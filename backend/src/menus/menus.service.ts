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

  // 1. Crear: Inyectamos el user_id e incluimos el proveedor_id si viene en el DTO
  async create(createMenusDto: CreateMenusDto, userId: number): Promise<Menus> {
    const menuData = { ...createMenusDto };
    
    // Lógica de negocio para categorías
    if (menuData.categoria !== 'ESPECIAL') {
      menuData.dieta_especifica = null;
    }
    
    const nuevoMenu = this.menusRepository.create({
      ...menuData,
      users_id: userId, 
    });

    return await this.menusRepository.save(nuevoMenu);
  }

  async findAll(userId: number): Promise<Menus[]> {
    return await this.menusRepository.find({
      where: { users_id: userId }, 
      relations: ['proveedor'], // Trae los datos del proveedor asociado usando LEFT JOIN
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number, userId: number): Promise<Menus> {
    const menu = await this.menusRepository.findOne({ 
      where: { id, users_id: userId },
      relations: ['proveedor'] // Trae el detalle del proveedor asignado
    });

    if (!menu) {
      throw new NotFoundException(`El menú con ID ${id} no existe en su cuenta`);
    }
    return menu;
  }

  // 4. Actualizar: Usamos merge + findOne cuidando el proveedor_id
  async update(id: number, updateMenusDto: UpdateMenusDto, userId: number): Promise<Menus> {
    // Primero aseguramos que el menú le pertenece (reutiliza findOne)
    const menuExistente = await this.findOne(id, userId);

    // Desestructuramos para controlar que proveedor_id no pise datos si viene undefined
    const { proveedor_id, ...datosAEditar } = updateMenusDto;

    const menuEditado = this.menusRepository.merge(menuExistente, {
      ...datosAEditar,
      precio: updateMenusDto.precio ? String(updateMenusDto.precio) : undefined,
      proveedor_id: proveedor_id !== undefined ? proveedor_id : menuExistente.proveedor_id
    });

    if (updateMenusDto.categoria && updateMenusDto.categoria !== 'ESPECIAL') {
        menuEditado.dieta_especifica = null;
    }

    return await this.menusRepository.save(menuEditado);
  }

  async delete(id: number, userId: number): Promise<void> {
    const menu = await this.findOne(id, userId); // Si no es suyo, findOne lanza el 404
    await this.menusRepository.remove(menu);
  }
}