import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserSignupDocument = UserSignup & Document;

@Schema()
export class UserSignup {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const UserSignupSchema = SchemaFactory.createForClass(UserSignup);
