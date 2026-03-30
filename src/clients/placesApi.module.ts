import { Module } from '@nestjs/common';
import { PlacesApiClient } from './placesApi.client';

@Module({
  providers: [PlacesApiClient],
  exports: [PlacesApiClient],
})
export class PlacesApiModule {}
