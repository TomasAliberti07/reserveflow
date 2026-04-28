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

  // 1. Crear: Inyectamos el user_id (singular, como en tu DB)
  async create(createMenusDto: CreateMenusDto, userId: number): Promise<Menus> {
    const menuData = { ...createMenusDto };
    
    // Lógica de negocio para categorías
    if (menuData.categoria !== 'ESPECIAL') {
      menuData.dieta_especifica = null;
    }
    
    const nuevoMenu = this.menusRepository.create({
      ...menuData,
      users_id: userId, // Asignamos el dueño automáticamente
    });

    return await this.menusRepository.save(nuevoMenu);
  }

  // 2. Listar: Solo los que pertenecen al usuario logueado
  async findAll(userId: number): Promise<Menus[]> {
    return await this.menusRepository.find({
      where: { users_id: userId }, 
      order: { nombre: 'ASC' }
    });
  }

  // 3. Buscar uno: Validamos existencia Y propiedad del usuario
  async findOne(id: number, userId: number): Promise<Menus> {
    const menu = await this.menusRepository.findOne({ 
      where: { id, users_id: userId } 
    });

    if (!menu) {
      throw new NotFoundException(`El menú con ID ${id} no existe en su cuenta`);
    }
    return menu;
  }

  // 4. Actualizar: Usamos merge + findOne para máxima seguridad
  async update(id: number, updateMenusDto: UpdateMenusDto, userId: number): Promise<Menus> {
    // Primero aseguramos que el menú le pertenece (reutiliza findOne)
    const menuExistente = await this.findOne(id, userId);

    const menuEditado = this.menusRepository.merge(menuExistente, {
      ...updateMenusDto,
      // Convertimos a string para que coincida con @Column({ type: 'decimal' }) en la entidad
      precio: updateMenusDto.precio ? String(updateMenusDto.precio) : undefined,
    });

    // Si cambian la categoría en el update, podrías replicar la lógica de dieta_especifica aquí
    if (updateMenusDto.categoria && updateMenusDto.categoria !== 'ESPECIAL') {
        menuEditado.dieta_especifica = null;
    }

    return await this.menusRepository.save(menuEditado);
  }

  // 5. Eliminar: Seguridad ante todo
  async delete(id: number, userId: number): Promise<void> {
    const menu = await this.findOne(id, userId); // Si no es suyo, findOne lanza el 404
    await this.menusRepository.remove(menu);
  }
}