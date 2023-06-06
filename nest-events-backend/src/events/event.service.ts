import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { Event } from './event.entity';
import { ListEvents, WhenEventFilter } from './input/list.event';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>
  ) {}

  public async getEvent(id: number): Promise<Event> {
    return await this.getEventBaseQuery()
      .andWhere('e.id = :id', { id })
      .getOne();
  }

  private getEventBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted
          })
      );
  }

  public async getEventsWithAttendeeCountFilter(filter: ListEvents) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (filter && filter.when) {
      switch (Number(filter.when)) {
        case WhenEventFilter.Today:
          console.log('today');
          query = query.andWhere(
            'e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY'
          );
          break;

        case WhenEventFilter.Tomorrow:
          query = query.andWhere(
            'e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY'
          );
          break;

        case WhenEventFilter.ThisWeek:
          console.log('Thisweek');
          query = query.andWhere(
            'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)'
          );
          break;

        case WhenEventFilter.NextWeek:
          query = query.andWhere(
            'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1'
          );
          break;
      }
    }

    return query.getMany();
  }
}
