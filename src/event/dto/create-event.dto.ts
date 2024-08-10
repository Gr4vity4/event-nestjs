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
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Event name',
    description: 'Name of the event',
  })
  @IsNotEmpty()
  @IsString()
  readonly eventName: string;

  @ApiProperty({
    type: Date,
    required: true,
    example: '2024-09-01',
    description: 'Date of the event',
  })
  @IsNotEmpty()
  @IsDate()
  readonly eventDate: Date;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Event location',
    description: 'Location of the event',
  })
  @IsNotEmpty()
  @IsString()
  readonly eventLocation: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Event description',
    description: 'Description of the event',
  })
  @IsNotEmpty()
  @IsString()
  readonly eventDescription: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
    description: 'Event capacity',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  readonly eventCapacity: number;

  @ApiProperty({
    type: Number,
    default: 0,
    example: 0,
    description: 'Number of attendees registered',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  readonly registeredAttendees?: number = 0;

  @ApiProperty({
    type: String,
    required: true,
    example: 'A',
    description: 'Prefix for seat number',
  })
  @IsNotEmpty()
  @IsString()
  readonly prefixSeatNumber: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
    description: 'First seat number',
  })
  @IsNotEmpty()
  @IsInt()
  readonly beginSeatNumber: number;
}
