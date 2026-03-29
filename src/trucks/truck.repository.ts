import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TruckDocument } from './schema/truck.schema';
import { CreateTruckData } from './types/create-truck-data.type';
import { Truck } from './entities/truck.entity';
import { UpdateTruckData } from './types/update-truck-data.type';
import { User } from 'src/users/entities/user.entity';
import { EntityNotFoundError } from 'src/shared/errors/errors';
import { TruckMapper } from './mappers/truck.mapper';
import { TruckDbRaw } from 'src/orders/types/order-db-raw';

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
      .populate('user')
      .lean()
      .exec();

    if (!addedTruck)
      throw new EntityNotFoundError('Truck not found', newTruck._id.toString());

    return TruckMapper.toEntity(addedTruck as unknown as TruckDbRaw);
  }

  async findAll(): Promise<Truck[]> {
    const trucks = await this.truckModel
      .find()
      .populate<{ user: User }>('user');

    return trucks.map((truck) =>
      TruckMapper.toEntity(truck as unknown as TruckDbRaw),
    );
  }

  async findByPlates(plates: string): Promise<Truck | null> {
    const truck = await this.truckModel
      .findOne({ plates })
      .populate<{ user: User }>('user')
      .exec();

    if (!truck) return null;

    return TruckMapper.toEntity(truck as unknown as TruckDbRaw);
  }

  async findById(id: string): Promise<Truck | null> {
    const truck = await this.truckModel
      .findById(id)
      .populate<{ user: User }>('user')
      .exec();

    if (!truck) return null;

    return TruckMapper.toEntity(truck as unknown as TruckDbRaw);
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

    return TruckMapper.toEntity(updatedTruck as unknown as TruckDbRaw);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.truckModel.findByIdAndDelete(id).exec();

    if (!deleted) return false;
    return true;
  }
}
