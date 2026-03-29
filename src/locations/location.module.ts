import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationDocument, LocationSchema } from './schema/location.schema';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { PlacesApiModule } from 'src/clients/placesApi.module';
import { LocationRepository } from './location.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LocationDocument.name, schema: LocationSchema },
    ]),
    PlacesApiModule,
  ],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationRepository],
})
export class LocationModule {}
