import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TruckDocument } from './schema/truck.schema';
import { CreateTruckData } from './types/create-truck-data.type';
import { Truck } from './entities/truck.entity';
import { UpdateTruckData } from './types/update-truck-data.type';
import { User } from 'src/users/entities/user.entity';
import { EntityNotFoundError } from 'src/shared/errors/errors';

@Injectable()
export class TruckRepository {
  constructor(
    @InjectModel(TruckDocument.name)
    private readonly truckModel: Model<TruckDocument>,
  ) {}

  async create(createTruckData: CreateTruckData): Promise<Truck> {
    const newTruck = await this.truckModel.create({
      ...createTruckData,
      user: new Types.ObjectId(createTruckData.user),
    });

    const addedTruck = await this.truckModel
      .findById(newTruck._id)
      .populate<{ user: User }>('user');

    if (!addedTruck)
      throw new EntityNotFoundError('Truck not found', newTruck._id.toString());

    return new Truck(
      addedTruck.id,
      addedTruck.year,
      addedTruck.color,
      addedTruck.plates,
      addedTruck.user,
    );
  }

  async findAll(): Promise<Truck[]> {
    const trucks = await this.truckModel
      .find()
      .populate<{ user: User }>('user');

    return trucks.map(
      (truck) =>
        new Truck(
          truck._id.toString(),
          truck.year,
          truck.color,
          truck.plates,
          truck.user,
        ),
    );
  }

  async findByPlates(plates: string): Promise<Truck | null> {
    const truck = await this.truckModel
      .findOne({ plates })
      .populate<{ user: User }>('user')
      .exec();

    if (!truck) return null;

    return new Truck(
      truck._id.toString(),
      truck.year,
      truck.color,
      truck.plates,
      truck.user,
    );
  }

  async findById(id: string): Promise<Truck | null> {
    const truck = await this.truckModel
      .findById(id)
      .populate<{ user: User }>('user')
      .exec();

    if (!truck) return null;

    return new Truck(
      truck._id.toString(),
      truck.year,
      truck.color,
      truck.plates,
      truck.user,
    );
  }

  async update(
    id: string,
    updateTruckData: UpdateTruckData,
  ): Promise<Truck | null> {
    const updated = await this.truckModel.findByIdAndUpdate(
      id,
      updateTruckData,
      {
        new: true,
      },
    );

    if (!updated) return null;

    const updatedTruck = await this.truckModel
      .findById(updated._id)
      .populate<{ user: User }>('user');

    if (!updatedTruck)
      throw new EntityNotFoundError('Truck not found', updated._id.toString());

    return new Truck(
      updatedTruck._id.toString(),
      updatedTruck.year,
      updatedTruck.color,
      updatedTruck.plates,
      updatedTruck.user,
    );
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.truckModel.findByIdAndDelete(id).exec();

    if (!deleted) return false;
    return true;
  }
}

// const trucks = await this.truckModel.aggregate([
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'user',
//       foreignField: '_id',
//       as: 'userDetails',
//     },
//   },
//   { $unwind: '$userDetails' },
// ]);
