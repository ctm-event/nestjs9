import { OmitType } from '@nestjs/mapped-types';
import { EventEntity } from './event.entity';

export class CreateEventDto extends OmitType(EventEntity, ['id'] as const) {}
