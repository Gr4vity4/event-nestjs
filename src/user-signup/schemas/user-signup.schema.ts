import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserSignupDocument = UserSignup & Document;

@Schema({
  collection: 'user_signups',
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
})
export class UserSignup {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  seatNumber: string;

  @Prop()
  isActive: boolean;
}

export const UserSignupSchema = SchemaFactory.createForClass(UserSignup);
