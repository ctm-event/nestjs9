import { OmitType } from '@nestjs/mapped-types';
import { Event } from './event.entity';

export class CreateEventDto extends OmitType(Event, ['id'] as const) {}
