import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSignupDto } from './dto/create-user-signup.dto';
import { UpdateUserSignupDto } from './dto/update-user-signup.dto';
import { Model } from 'mongoose';
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

  async findAll(): Promise<UserSignup[]> {
    return this.userSignupModel.find();
  }

  async findOne(id: string): Promise<UserSignup> {
    return this.userSignupModel
      .findById(id)
      .orFail(
        () => new NotFoundException(`UserSignup with id ${id} not found`),
      );
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
