import { Injectable } from '@nestjs/common';
import {
  BadRequestError,
  ConflictError,
  EntityNotFoundError,
} from 'src/shared/errors/errors';
import { LocationRepository } from './location.repository';

import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PlacesApiClient } from 'src/clients/placesApi.client';

@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly placeApiClient: PlacesApiClient,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { place_id } = createLocationDto;
    const existingLocation =
      await this.locationRepository.findByPlaceId(place_id);

    if (existingLocation) throw new ConflictError('Location already exist');

    const placeIdData = await this.placeApiClient.getPlaceData(place_id);

    if (!placeIdData) throw new BadRequestError('place_id');

    const dataToCreate = {
      address: placeIdData.address,
      place_id: place_id,
      latitude: placeIdData.latitude,
      longitude: placeIdData.longitude,
    };

    const newLocation = await this.locationRepository.create(dataToCreate);

    return newLocation;
  }

  async findAll(): Promise<Location[]> {
    const locations = await this.locationRepository.findAll();

    return locations;
  }

  async findById(id: string): Promise<Location> {
    const location = await this.locationRepository.findById(id);

    if (!location) throw new EntityNotFoundError('Location', id);

    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const { place_id } = updateLocationDto;

    const existingLocation =
      await this.locationRepository.findByPlaceId(place_id);
    if (existingLocation && existingLocation.id !== id)
      throw new ConflictError('Location already exist');

    const placeIdData = await this.placeApiClient.getPlaceData(place_id);

    if (!placeIdData) throw new BadRequestError('place_id');

    const dataToSave = {
      address: placeIdData.address,
      place_id: place_id,
      latitude: placeIdData.latitude,
      longitude: placeIdData.longitude,
    };

    const updatedLocation = await this.locationRepository.update(
      id,
      dataToSave,
    );

    if (!updatedLocation) throw new EntityNotFoundError('Location', id);

    return updatedLocation;
  }

  async delete(id: string): Promise<void> {
    //TODO hacer control de si tiene ordenes asociados

    const deleted = await this.locationRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('Truck', id);
  }
}
