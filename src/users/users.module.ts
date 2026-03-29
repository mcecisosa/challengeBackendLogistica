import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './schema/user.schema';
import { UserRepository } from './user.repository';
import { SharedModule } from 'src/shared/shared.module';
import { OrdersModule } from 'src/orders/order.module';
import { TrucksModule } from 'src/trucks/trucks.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    SharedModule,
    forwardRef(() => OrdersModule),
    forwardRef(() => TrucksModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
