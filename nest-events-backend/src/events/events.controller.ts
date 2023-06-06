import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';
import { EventService } from './event.service';
import { CreateEventDto } from './input/create-event.dto';
import { ListEvents } from './input/list.event';
import { UpdateEventDto } from './input/update-event.dto';

@Controller('/events')
export class EventsController {
  private readonly logger: Logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private eventService: EventService
  ) {}

  @Get('practice')
  async practice() {
    return await this.eventService.getEventsWithAttendeeCountQuery().getMany();
  }

  @Get()
  async findAll(@Query() filter: ListEvents) {
    console.log(`Hit the findAll route`, filter);
    return this.eventService.getEventsWithAttendeeCountFilter(filter);
    // return this.eventRepository.find({
    //   where: [
    //     {
    //       id: MoreThan(3),
    //       when: MoreThan(new Date('2021-02-12'))
    //     },
    //     {
    //       description: Like('%meet%')
    //     }
    //   ],
    //   take: 2
    // });
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when)
    };
    try {
      const saveResult = await this.eventRepository.save(event);
      return saveResult;
    } catch (error) {
      return error;
    }
  }

  @Put()
  updateOrCreate() {}

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    let event = await this.eventRepository.findOneBy({ id: parseInt(id) });
    console.log(event, input);
    if (event) {
      event = {
        ...event,
        ...input,
        when: input.when ? new Date(input.when) : event.when
      };
    }
    return this.eventRepository.save(event);
  }

  @Delete()
  @HttpCode(202)
  async remove(@Param('id') id) {
    const event = await this.eventRepository.findOneBy({ id: parseInt(id) });
    await this.eventRepository.delete(event);
  }
}
