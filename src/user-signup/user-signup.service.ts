import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSignupDto } from './dto/create-user-signup.dto';
import { UpdateUserSignupDto } from './dto/update-user-signup.dto';
import { Model, Types } from 'mongoose';
import { UserSignup, UserSignupDocument } from './schemas/user-signup.schema';
import { InjectModel } from '@nestjs/mongoose';
import { EventService } from '../event/event.service';
import { Event } from '../event/schemas/event.schema';

@Injectable()
export class UserSignupService {
  constructor(
    @InjectModel(UserSignup.name)
    private userSignupModel: Model<UserSignupDocument>,
    private eventService: EventService,
  ) {}

  async create(createUserSignupDto: CreateUserSignupDto): Promise<UserSignup> {
    // check available seat
    const eventId = createUserSignupDto.eventId;
    const event: Event = await this.eventService.findOne(eventId);

    // Check available capacity
    const currentSignups = await this.userSignupModel.countDocuments({
      eventId,
    });
    if (currentSignups >= event.eventCapacity) {
      throw new ConflictException('Event is full');
    }

    // Check if the user has already signed up
    const existingSignup = await this.userSignupModel.findOne({
      eventId,
      firstName: createUserSignupDto.firstName,
      lastName: createUserSignupDto.lastName,
    });

    if (existingSignup) {
      throw new ConflictException('User has already signed up for this event');
    }

    // Create signup
    const preparedData = {
      ...createUserSignupDto,
      seatNumber: `${event.prefixSeatNumber}${event.beginSeatNumber}`,
      isActive: true,
    };
    const newSignup = await this.userSignupModel.create(preparedData);

    // Update event's beginSeatNumber
    await this.eventService.update(eventId, {
      beginSeatNumber: event.beginSeatNumber + 1,
    });

    return newSignup;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortField: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
    search?: string,
  ): Promise<{
    registrations: any[];
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
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    aggregationPipeline.push(
      {
        $addFields: {
          eventObjectId: { $toObjectId: '$eventId' },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventObjectId',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          eventId: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          seatNumber: 1,
          isActive: 1,
          event: 1,
          createdAt: 1,
          updatedAt: 1,
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

    const [registrations, total] = await Promise.all([
      this.userSignupModel.aggregate(aggregationPipeline),
      this.userSignupModel.countDocuments(
        search
          ? {
              $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
              ],
            }
          : {},
      ),
    ]);

    return {
      registrations,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<UserSignup> {
    const aggregationPipeline = [
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $addFields: {
          eventObjectId: { $toObjectId: '$eventId' },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: 'eventObjectId',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          seatNumber: 1,
          isActive: 1,
          event: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const [result] = await this.userSignupModel.aggregate(aggregationPipeline);

    if (!result) {
      throw new NotFoundException(`UserSignup with ID "${id}" not found`);
    }

    return result;
  }

  async update(
    id: string,
    updateUserSignupDto: UpdateUserSignupDto,
  ): Promise<UserSignup> {
    return this.userSignupModel
      .findByIdAndUpdate(id, updateUserSignupDto, {
        new: true,
      })
      .orFail(
        () => new NotFoundException(`UserSignup with id ${id} not found`),
      );
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.userSignupModel
      .findByIdAndDelete(id)
      .orFail(
        () => new NotFoundException(`UserSignup with id ${id} not found`),
      );

    return { message: 'UserSignup deleted successfully' };
  }

  async cancel(id: string): Promise<{ message: string }> {
    const signup = await this.userSignupModel
      .findById(id)
      .orFail(
        () => new NotFoundException(`UserSignup with id ${id} not found`),
      );

    // Set isActive to false
    await signup.updateOne({ isActive: false });

    return { message: 'UserSignup cancelled successfully' };
  }
}
