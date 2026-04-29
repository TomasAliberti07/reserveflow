import { Controller, Get, Body, Post, Patch, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { JwtAuthGuard } from '../auth/jwt_auth_guard';
import { CreateSalonsDto } from '../dto/create_salons_dto';
import { UpdateSalonsDto } from '../dto/update_salons_dto';

@UseGuards(JwtAuthGuard)
@Controller('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}
  @Get()
  findAll(@Req() req) {
    return this.salonsService.findAll(req.user.id);
  }
  @Get('active')
  findActive(@Req() req) {
    return this.salonsService.findActive(req.user.id);
  }
  @Post()
  create(@Body() createSalonDto: CreateSalonsDto, @Req() req) {
    return this.salonsService.create(createSalonDto, req.user.id);
  }
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateSalonsDto: UpdateSalonsDto, 
    @Req() req
  ) {
    return this.salonsService.update(+id, updateSalonsDto, req.user.id);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.salonsService.remove(+id, req.user.id);
  }
}