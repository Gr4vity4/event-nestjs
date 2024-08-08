import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class EventsService {
  private events: CreateEventDto[] = [
    {
      id: 1,
      eventName: 'Event 1',
      eventDate: new Date(),
      eventLocation: 'Location 1',
      eventDescription: 'Description 1',
      eventCapacity: 100,
      registeredAttendees: 50,
      prefixSeatNumber: 'A',
      beginSeatNumber: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      eventName: 'Event 2',
      eventDate: new Date(),
      eventLocation: 'Location 2',
      eventDescription: 'Description 2',
      eventCapacity: 200,
      registeredAttendees: 100,
      prefixSeatNumber: 'A',
      beginSeatNumber: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  create(createEventDto: CreateEventDto) {
    this.events.push(createEventDto);
    return this.events;
  }

  findAll() {
    return this.events;
  }

  findOne(id: number) {
    const result = this.events.find((event) => event.id === id);

    if (!result) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return result;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    const event = this.findOne(id);

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    const index = this.events.indexOf(event);
    this.events[index] = { ...event, ...updateEventDto };
    return this.events[index];
  }

  remove(id: number) {
    const event = this.findOne(id);

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    const index = this.events.indexOf(event);
    this.events.splice(index, 1);
    return this.events;
  }
}
