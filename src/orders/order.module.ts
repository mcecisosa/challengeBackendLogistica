import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
import { OrdersController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { UserDocument, UserSchema } from 'src/users/schema/user.schema';
import { UsersModule } from 'src/users/users.module';
import { TruckDocument, TruckSchema } from 'src/trucks/schema/truck.schema';
import {
  LocationDocument,
  LocationSchema,
} from 'src/locations/schema/location.schema';
import { TrucksModule } from 'src/trucks/trucks.module';
import { LocationModule } from 'src/locations/location.module';
import { OrderDocument, OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
      { name: TruckDocument.name, schema: TruckSchema },
      { name: UserDocument.name, schema: UserSchema },
      { name: LocationDocument.name, schema: LocationSchema },
    ]),
    SharedModule,
    UsersModule,
    TrucksModule,
    LocationModule,
  ],
  controllers: [OrdersController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository],
})
export class OrdersModule {}
