import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDocument } from './schema/location.schema';
import { Location } from './entities/location.entity';
import { CreateLocationData } from './types/create-location-data.type';
import { UpdateLocationData } from './types/update-location-data.type';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectModel(LocationDocument.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(createLocationData: CreateLocationData): Promise<Location> {
    const newLocation = await this.locationModel.create(createLocationData);

    return new Location(
      newLocation._id.toString(),
      newLocation.address,
      newLocation.place_id,
      newLocation.latitude,
      newLocation.longitude,
    );
  }

  async findAll(): Promise<Location[]> {
    const locations = await this.locationModel.find();

    return locations.map(
      (loc) =>
        new Location(
          loc._id.toString(),
          loc.address,
          loc.place_id,
          loc.latitude,
          loc.longitude,
        ),
    );
  }

  async findByPlaceId(place_id: string): Promise<Location | null> {
    const location = await this.locationModel.findOne({ place_id }).exec();

    if (!location) return null;

    return new Location(
      location._id.toString(),
      location.address,
      location.place_id,
      location.latitude,
      location.longitude,
    );
  }

  async findById(id: string): Promise<Location | null> {
    const location = await this.locationModel.findById(id).exec();

    if (!location) return null;

    return new Location(
      location._id.toString(),
      location.address,
      location.place_id,
      location.latitude,
      location.longitude,
    );
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

    return new Location(
      updated._id.toString(),
      updated.address,
      updated.place_id,
      updated.latitude,
      updated.longitude,
    );
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.locationModel.findByIdAndDelete(id).exec();

    if (!deleted) return false;
    return true;
  }
}
