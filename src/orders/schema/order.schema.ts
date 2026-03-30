import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LocationDocument } from 'src/locations/schema/location.schema';
import { TruckDocument } from 'src/trucks/schema/truck.schema';
import { UserDocument } from 'src/users/schema/user.schema';
import { OrderStatus } from '../types/order-status.enum';

@Schema()
export class OrderDocument extends Document {
  @Prop({ type: Types.ObjectId, ref: UserDocument.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TruckDocument.name, required: true })
  truck: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: LocationDocument.name, required: true })
  pickup: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: LocationDocument.name, required: true })
  dropoff: Types.ObjectId;

  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
