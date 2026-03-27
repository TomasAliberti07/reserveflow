import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { BebidaService } from './bebida.service';
import { CreateBebidaDto } from '../dto/create_bebida_dto';
import { UpdateBebidaDto } from '../dto/update_bebida_dto';

@Controller('bebida')
export class BebidaController {
  constructor(private readonly bebidaService: BebidaService) {}

  @Post()
  create(@Body() createBebidaDto: CreateBebidaDto) {
    return this.bebidaService.create(createBebidaDto);
  }

  @Get()
  findAll() {
    return this.bebidaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bebidaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBebidaDto: UpdateBebidaDto) {
    return this.bebidaService.update(+id, updateBebidaDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bebidaService.delete(+id);
  }
}
