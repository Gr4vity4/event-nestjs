import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Model, Types } from 'mongoose';
import { UserSignup } from '../user-signup/schemas/user-signup.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(UserSignup.name)
    private userSignupModel: Model<UserSignup>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventModel.create(createEventDto);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortField: string = 'eventDate',
    sortOrder: 'asc' | 'desc' = 'asc',
    search?: string,
  ): Promise<{
    events: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const aggregationPipeline: any[] = [];

    // Search functionality
    if (search) {
      aggregationPipeline.push({
        $match: {
          $or: [{ eventName: { $regex: search, $options: 'i' } }],
        },
      });
    }

    aggregationPipeline.push(
      {
        $addFields: {
          stringId: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'user_signups',
          localField: 'stringId',
          foreignField: 'eventId',
          as: 'signups',
        },
      },
      {
        $addFields: {
          signupCount: { $size: '$signups' },
          availableCapacity: {
            $subtract: ['$eventCapacity', { $size: '$signups' }],
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          eventName: 1,
          eventDate: 1,
          eventLocation: 1,
          eventDescription: 1,
          eventCapacity: 1,
          registeredAttendees: 1,
          prefixSeatNumber: 1,
          beginSeatNumber: 1,
          signupCount: 1,
          availableCapacity: 1,
          createdAt: 1,
          updatedAt: 1,
          signups: 1,
        },
      },
      {
        $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    );

    const [events, total] = await Promise.all([
      this.eventModel.aggregate(aggregationPipeline),
      this.eventModel.countDocuments(
        search
          ? {
              $or: [{ eventName: { $regex: search, $options: 'i' } }],
            }
          : {},
      ),
    ]);

    // console.log('Search term:', search);
    // console.log('Total events found:', total);
    // console.log(
    //   'Events:',
    //   events.map((e) => e.eventName),
    // );

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
    await this.eventModel
      .findByIdAndDelete(id)
      .orFail(() => new NotFoundException(`Event with id ${id} not found`));

    return { message: `Event deleted successfully` };
  }

  async getEventSignups(
    eventId: string,
    page: number = 1,
    limit: number = 10,
    sortField: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<{
    signups: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      // Ensure the event exists
      const event = await this.eventModel.findById(eventId);
      if (!event) {
        throw new NotFoundException(`Event with id ${eventId} not found`);
      }

      // Build the query
      const query: any = { eventId };
      if (search && typeof search === 'string' && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [{ firstName: searchRegex }, { lastName: searchRegex }];
      }

      // Execute the query with sorting and pagination
      const signups = await this.userSignupModel
        .find(query)
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await this.userSignupModel.countDocuments(query);

      const transformedSignups = signups.map((signup: any) => {
        return {
          id: signup._id,
          firstName: signup.firstName,
          lastName: signup.lastName,
          seatNumber: signup.seatNumber,
          createdAt: signup.createdAt,
        };
      });

      return {
        signups: transformedSignups,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
