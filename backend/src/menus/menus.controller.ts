import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenusDto } from '../dto/create_menus_dto';
import { UpdateMenusDto } from '../dto/update_menus_dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() createMenusDto: CreateMenusDto) {
    return this.menusService.create(createMenusDto);
  }

  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMenusDto: UpdateMenusDto) {
    return this.menusService.update(+id, updateMenusDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.menusService.delete(+id);
  }
}
