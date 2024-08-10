import { Injectable, ConflictException } from '@nestjs/common';
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
    const result = await this.userSignupModel.create(createUserSignupDto);

    // increment registeredAttendees
    await this.eventService.update(eventId, {
      registeredAttendees: event.registeredAttendees + 1,
    });

    return result;
  }

  async findAll(): Promise<UserSignup[]> {
    return this.userSignupModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} userSignup`;
  }

  update(id: number, updateUserSignupDto: UpdateUserSignupDto) {
    return `This action updates a #${id} userSignup`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSignup`;
  }
}
