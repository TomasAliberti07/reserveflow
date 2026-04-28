import { Controller, Get, Post, Body, Put, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenusDto } from '../dto/create_menus_dto';
import { UpdateMenusDto } from '../dto/update_menus_dto';
import { JwtAuthGuard } from '../auth/jwt_auth_guard';

@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() createMenusDto: CreateMenusDto, @Req() req) {
    return this.menusService.create(createMenusDto, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.menusService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.menusService.findOne(+id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMenusDto: UpdateMenusDto, @Req() req) {
    return this.menusService.update(+id, updateMenusDto, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.menusService.delete(+id, req.user.id );
  }
}
