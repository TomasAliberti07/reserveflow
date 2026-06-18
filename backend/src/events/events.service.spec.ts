import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from './events.entity';
import { Salones } from '../salons/salons.entity';
import { Eventomenus } from './eventomenus.entity';
import { Eventobebida } from './eventobebida.entity';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: { find: jest.Mock };

  beforeEach(async () => {
    eventRepository = {
      find: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: eventRepository,
        },
        {
          provide: getRepositoryToken(Salones),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Eventomenus),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Eventobebida),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should keep canceled events in the response so they can still be searched', async () => {
    const canceledEvent = {
      id: 1,
      estado: 'cancelado',
      cliente_nombre: 'Ana',
      cliente_apellido: 'García',
    };

    eventRepository.find.mockResolvedValue([canceledEvent]);

    const result = await service.findAll();

    expect(result).toEqual([canceledEvent]);
  });
});
