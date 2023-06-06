import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { EventService } from './event.service';

@Module({
  controllers: [EventsController],
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  providers: [EventService]
})
export class EventsModule {}
