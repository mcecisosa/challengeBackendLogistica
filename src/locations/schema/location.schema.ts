import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LocationDocument extends Document {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true })
  place_id: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(LocationDocument);
