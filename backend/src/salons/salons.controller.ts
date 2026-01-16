import { Controller, Get } from '@nestjs/common';
import { SalonsService } from './salons.service';

@Controller('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @Get()
  findAll() {
    return this.salonsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.salonsService.findActive();
  }
}
