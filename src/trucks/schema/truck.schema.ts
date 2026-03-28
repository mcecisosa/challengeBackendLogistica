import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserDocument } from 'src/users/schema/user.schema';

@Schema()
export class TruckDocument extends Document {
  @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, unique: true })
  plates: string;
}

export const TruckSchema = SchemaFactory.createForClass(TruckDocument);
