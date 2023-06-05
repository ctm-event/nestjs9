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
  Put
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';
import { Attendee } from './attendee.entity';

@Controller('/events')
export class EventsController {
  private readonly logger: Logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>
  ) {}

  @Get('practice')
  async practice() {
    const attendee = new Attendee();
    attendee.name = 'Steven Nguyen';

    const event = new Event();
    event.id = 1;
    attendee.event = event;

    return await this.attendeeRepository.save(attendee);
  }

  @Get()
  async findAll() {
    this.logger.log(`Hit the findAll route`);
    return this.eventRepository.find({
      where: [
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12'))
        },
        {
          description: Like('%meet%')
        }
      ],
      take: 2
    });
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
