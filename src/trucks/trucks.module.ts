import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SharedModule } from 'src/shared/shared.module';
import { TruckDocument, TruckSchema } from './schema/truck.schema';
import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';
import { TruckRepository } from './truck.repository';
import { UserDocument, UserSchema } from 'src/users/schema/user.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TruckDocument.name, schema: TruckSchema },
      { name: UserDocument.name, schema: UserSchema },
    ]),
    SharedModule,
    UsersModule,
  ],
  controllers: [TrucksController],
  providers: [TrucksService, TruckRepository],
  exports: [TruckRepository],
})
export class TrucksModule {}
