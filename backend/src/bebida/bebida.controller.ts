import { Controller, Get, Post, Body, Put, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { BebidaService } from './bebida.service';
import { CreateBebidaDto } from '../dto/create_bebida_dto';
import { UpdateBebidaDto } from '../dto/update_bebida_dto';
import { JwtAuthGuard } from '../auth/jwt_auth_guard';

@UseGuards(JwtAuthGuard)
@Controller('bebida')
export class BebidaController {
  constructor(private readonly bebidaService: BebidaService) {}

  @Post()
  create(@Body() createBebidaDto: CreateBebidaDto, @Req() req) {
    return this.bebidaService.create(createBebidaDto, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.bebidaService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.bebidaService.findOne(+id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBebidaDto: UpdateBebidaDto, @Req() req) {
    return this.bebidaService.update(+id, updateBebidaDto, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.bebidaService.delete(+id, req.user.id);
  }
}
