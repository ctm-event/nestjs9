import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('/events')
export class EventsController {
  private events: Event[] = [];

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return this.eventRepository.find();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventRepository.findOneBy({ id: parseInt(id) });
    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
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
        when: input.when ? new Date(input.when) : event.when,
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
