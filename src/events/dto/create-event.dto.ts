import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsDate,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsOptional()
  @IsInt()
  readonly id?: number;

  @IsNotEmpty()
  @IsString()
  readonly eventName: string;

  @IsNotEmpty()
  @IsDate()
  readonly eventDate: Date;

  @IsNotEmpty()
  @IsString()
  readonly eventLocation: string;

  @IsNotEmpty()
  @IsString()
  readonly eventDescription: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  readonly eventCapacity: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1000)
  readonly registeredAttendees: number;

  @IsNotEmpty()
  @IsString()
  readonly prefixSeatNumber: string;

  @IsNotEmpty()
  @IsInt()
  readonly beginSeatNumber: number;

  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;

  @Type(() => Date)
  @IsDate()
  readonly updatedAt: Date;
}
