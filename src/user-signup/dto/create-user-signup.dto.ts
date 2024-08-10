import { IsString, IsNotEmpty, MinLength, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSignupDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '66b641e87e6e7778609815f6',
    description: 'MongoDB ObjectId as a string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @Transform(({ value }) => value)
  readonly eventId: string;

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
}
