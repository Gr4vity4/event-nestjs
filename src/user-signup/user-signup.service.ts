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
    console.log('found event', event);

    if (event.registeredAttendees >= event.eventCapacity) {
      throw new ConflictException('Event is full');
    }

    // check already signed up
    const existingSignup = await this.userSignupModel.findOne({
      eventId,
      firstName: createUserSignupDto.firstName,
      lastName: createUserSignupDto.lastName,
    });

    if (existingSignup) {
      throw new ConflictException('Already signed up');
    }

    // create signup
    const preparedData = {
      ...createUserSignupDto,
      seatNumber: `${event.prefixSeatNumber}${event.beginSeatNumber}`,
    };
    const result = await this.userSignupModel.create(preparedData);

    // increment registeredAttendees
    await this.eventService.update(eventId, {
      beginSeatNumber: event.beginSeatNumber + 1,
      registeredAttendees: event.registeredAttendees + 1,
    });

    return result;
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
}
