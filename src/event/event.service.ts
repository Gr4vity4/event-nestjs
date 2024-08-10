import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const eventData = {
      ...createEventDto,
      registeredAttendees: createEventDto.registeredAttendees ?? 0,
    };
    return this.eventModel.create(eventData);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      this.eventModel.find().skip(skip).limit(limit).exec(),
      this.eventModel.countDocuments(),
    ]);

    return {
      events,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Event> {
    return this.eventModel
      .findById(id)
      .orFail(() => new NotFoundException(`Event with id ${id} not found`));
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventModel
      .findByIdAndUpdate(id, updateEventDto, {
        new: true,
      })
      .orFail(() => new NotFoundException(`Event with id ${id} not found`));
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.eventModel.findByIdAndDelete(id).orFail(() => {
      throw new NotFoundException(`Event with id ${id} not found`);
    });

    return { message: `Delete successful` };
  }
}
