import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {}

  @Get('/:id')
  findOne(@Param() id: string) {
    return {
      id,
      name: 'streven',
    };
  }

  @Post()
  create(@Body() body: CreateEventDto) {
    return body;
  }

  @Put()
  updateOrCreate() {}

  @Patch()
  update(@Body() body: UpdateEventDto) {}

  @Delete()
  @HttpCode(202)
  remove(@Param() id) {
    return id;
  }
}
