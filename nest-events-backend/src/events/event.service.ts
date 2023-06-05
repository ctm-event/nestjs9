import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>
  ) {}

  private getEventBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async getEvent(id: number): Promise<Event> {
    return await this.getEventBaseQuery()
      .andWhere('e.id = :id', { id })
      .getOne();
  }
}
