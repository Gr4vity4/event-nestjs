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
  @IsOptional()
  @IsInt()
  readonly id?: number;

  @ApiProperty({ example: 'Event name' })
  @IsNotEmpty()
  @IsString()
  readonly eventName: string;

  @ApiProperty({ example: '2021-12-31' })
  @IsNotEmpty()
  @IsDate()
  readonly eventDate: Date;

  @ApiProperty({ example: 'Event location' })
  @IsNotEmpty()
  @IsString()
  readonly eventLocation: string;

  @ApiProperty({ example: 'Event description' })
  @IsNotEmpty()
  @IsString()
  readonly eventDescription: string;

  @ApiProperty({ example: 100, description: 'Event capacity' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  readonly eventCapacity: number;

  @ApiProperty({ example: 0, description: 'Number of attendees registered' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1000)
  readonly registeredAttendees: number;

  @ApiProperty({ example: 'A', description: 'Prefix for seat number' })
  @IsNotEmpty()
  @IsString()
  readonly prefixSeatNumber: string;

  @ApiProperty({ example: 1, description: 'First seat number' })
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
