import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSignupDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'John',
    description: 'First name of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly firstName: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly lastName: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '08123456789',
    description: 'Phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  readonly phoneNumber: string;

  // @ApiProperty({
  //   type: String,
  //   required: true,
  //   example: 'A1',
  //   description: 'Seat number of the user',
  // })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly seatNumber: string;
}
