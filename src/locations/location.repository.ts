import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDocument } from './schema/location.schema';
import { Location } from './entities/location.entity';
import { CreateLocationData } from './types/create-location-data.type';
import { UpdateLocationData } from './types/update-location-data.type';
import { LocationMapper } from './mapper/location.mapper';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectModel(LocationDocument.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(createLocationData: CreateLocationData): Promise<Location> {
    const newLocation = await this.locationModel.create(createLocationData);

    return LocationMapper.toEntity(newLocation);
  }

  async findAll(): Promise<Location[]> {
    const locations = await this.locationModel.find();

    return locations.map((loc) => LocationMapper.toEntity(loc));
  }

  async findByPlaceId(place_id: string): Promise<Location | null> {
    const location = await this.locationModel.findOne({ place_id }).exec();

    if (!location) return null;

    return LocationMapper.toEntity(location);
  }

  async findById(id: string): Promise<Location | null> {
    const location = await this.locationModel.findById(id).exec();

    if (!location) return null;

    return LocationMapper.toEntity(location);
  }

  async update(
    id: string,
    updateLocationData: UpdateLocationData,
  ): Promise<Location | null> {
    const updated = await this.locationModel.findByIdAndUpdate(
      id,
      updateLocationData,
      {
        new: true,
      },
    );

    if (!updated) return null;

    return LocationMapper.toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.locationModel.findByIdAndDelete(id).exec();

    if (!deleted) return false;
    return true;
  }
}
