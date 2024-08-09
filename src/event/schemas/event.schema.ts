import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop({ required: true })
  eventLocation: string;

  @Prop({ required: true })
  eventDescription: string;

  @Prop({ required: true })
  eventCapacity: number;

  @Prop({ required: true })
  registeredAttendees: number;

  @Prop({ required: true })
  prefixSeatNumber: string;

  @Prop({ required: true })
  beginSeatNumber: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
