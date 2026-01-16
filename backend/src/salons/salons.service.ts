import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salon } from './salons.entity';

@Injectable()
export class SalonsService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
  ) {}

  findAll() {
    return this.salonRepository.find();
  }

  findActive() {
    return this.salonRepository.find({
      where: { estado: true },
    });
  }
}
