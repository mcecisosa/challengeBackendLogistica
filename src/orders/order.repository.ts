import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderData } from './types/create-order-data.type';
import { OrderDocument } from './schema/order.schema';
import { Order } from './entities/order.entity';
import { OrderDbRaw } from './types/order-db-raw';
import { OrderMapper } from './mappers/order.mapper';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderData: CreateOrderData): Promise<Order> {
    const { user, truck, pickup, dropoff } = createOrderData;

    const dataToCreate = {
      ...createOrderData,
      user: new Types.ObjectId(user),
      truck: new Types.ObjectId(truck),
      pickup: new Types.ObjectId(pickup),
      dropoff: new Types.ObjectId(dropoff),
    };
    const newOrder = await this.orderModel.create(dataToCreate);

    const result = await this.orderModel.aggregate<OrderDbRaw>([
      { $match: { _id: newOrder._id } },

      {
        $lookup: {
          from: 'userdocuments',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'truckdocuments',
          localField: 'truck',
          foreignField: '_id',
          as: 'truck',
        },
      },
      { $unwind: '$truck' },
      {
        $lookup: {
          from: 'userdocuments',
          localField: 'truck.user',
          foreignField: '_id',
          as: 'truck.user',
        },
      },
      { $unwind: '$truck.user' },
      {
        $lookup: {
          from: 'locationdocuments',
          localField: 'pickup',
          foreignField: '_id',
          as: 'pickup',
        },
      },
      { $unwind: '$pickup' },
      {
        $lookup: {
          from: 'locationdocuments',
          localField: 'dropoff',
          foreignField: '_id',
          as: 'dropoff',
        },
      },
      { $unwind: '$dropoff' },
      {
        $addFields: {
          id: { $toString: '$_id' },
          'user.id': { $toString: '$user._id' },
          'truck.id': { $toString: '$truck._id' },
          'truck.user.id': { $toString: '$truck.user._id' },
          'pickup.id': { $toString: '$pickup._id' },
          'dropoff.id': { $toString: '$dropoff._id' },
        },
      },
    ]);

    const orderData = result[0];

    return OrderMapper.toEntity(orderData);
  }

  // async findAll(): Promise<Truck[]> {
  //   const trucks = await this.truckModel
  //     .find()
  //     .populate<{ user: User }>('user');

  //   return trucks.map(
  //     (truck) =>
  //       new Truck(
  //         truck._id.toString(),
  //         truck.year,
  //         truck.color,
  //         truck.plates,
  //         truck.user,
  //       ),
  //   );
  // }

  // async findByPlates(plates: string): Promise<Truck | null> {
  //   const truck = await this.truckModel
  //     .findOne({ plates })
  //     .populate<{ user: User }>('user')
  //     .exec();

  //   if (!truck) return null;

  //   return new Truck(
  //     truck._id.toString(),
  //     truck.year,
  //     truck.color,
  //     truck.plates,
  //     truck.user,
  //   );
  // }

  // async findById(id: string): Promise<Truck | null> {
  //   const truck = await this.truckModel
  //     .findById(id)
  //     .populate<{ user: User }>('user')
  //     .exec();

  //   if (!truck) return null;

  //   return new Truck(
  //     truck._id.toString(),
  //     truck.year,
  //     truck.color,
  //     truck.plates,
  //     truck.user,
  //   );
  // }

  // async update(
  //   id: string,
  //   updateTruckData: UpdateTruckData,
  // ): Promise<Truck | null> {
  //   const updated = await this.truckModel.findByIdAndUpdate(
  //     id,
  //     updateTruckData,
  //     {
  //       new: true,
  //     },
  //   );

  //   if (!updated) return null;

  //   const updatedTruck = await this.truckModel
  //     .findById(updated._id)
  //     .populate<{ user: User }>('user');

  //   if (!updatedTruck)
  //     throw new EntityNotFoundError('Truck not found', updated._id.toString());

  //   return new Truck(
  //     updatedTruck._id.toString(),
  //     updatedTruck.year,
  //     updatedTruck.color,
  //     updatedTruck.plates,
  //     updatedTruck.user,
  //   );
  // }

  // async delete(id: string): Promise<boolean> {
  //   const deleted = await this.truckModel.findByIdAndDelete(id).exec();

  //   if (!deleted) return false;
  //   return true;
  // }
}
