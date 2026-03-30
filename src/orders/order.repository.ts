import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderData } from './types/create-order-data.type';
import { OrderDocument } from './schema/order.schema';
import { Order } from './entities/order.entity';
import { OrderDbRaw } from './types/order-db-raw';
import { OrderMapper } from './mappers/order.mapper';
import {
  UpdateOrderData,
  UpdateStatusOrderData,
} from './types/update-order-data.type';

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
      ...this.orderAggregationPipeline,
    ]);

    const orderData = result[0];

    return OrderMapper.toEntity(orderData);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderModel.aggregate<OrderDbRaw>([
      ...this.orderAggregationPipeline,
    ]);

    return orders.map((order) => OrderMapper.toEntity(order));
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.orderModel.aggregate<OrderDbRaw>([
      { $match: { _id: id } },
      ...this.orderAggregationPipeline,
    ]);

    const orderData = result[0];

    return OrderMapper.toEntity(orderData);
  }

  async update(
    id: string,
    updateOrderData: UpdateOrderData,
  ): Promise<Order | null> {
    const { user, truck, pickup, dropoff } = updateOrderData;

    const dataToUpdate = {
      user: user ? new Types.ObjectId(user) : undefined,
      truck: truck ? new Types.ObjectId(truck) : undefined,
      pickup: pickup ? new Types.ObjectId(pickup) : undefined,
      dropoff: dropoff ? new Types.ObjectId(dropoff) : undefined,
    };

    const updated = await this.orderModel.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
    });

    if (!updated) return null;

    const result = await this.orderModel.aggregate<OrderDbRaw>([
      { $match: { _id: new Types.ObjectId(id) } },
      ...this.orderAggregationPipeline,
    ]);

    const orderData = result[0];

    if (!orderData) return null;

    return OrderMapper.toEntity(orderData);
  }

  async updateStatus(
    id: string,
    updateStatusOrderData: UpdateStatusOrderData,
  ): Promise<Order | null> {
    const { status } = updateStatusOrderData;
    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      },
    );

    if (!updated) return null;

    const result = await this.orderModel.aggregate<OrderDbRaw>([
      { $match: { _id: new Types.ObjectId(id) } },
      ...this.orderAggregationPipeline,
    ]);

    const orderData = result[0];

    if (!orderData) return null;

    return OrderMapper.toEntity(orderData);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.orderModel.findByIdAndDelete(id).exec();

    if (!deleted) return false;
    return true;
  }

  async OrderHasLocation(locationId: string): Promise<boolean> {
    const count = await this.orderModel
      .countDocuments({
        $or: [
          { pickup: new Types.ObjectId(locationId) },
          { dropoff: new Types.ObjectId(locationId) },
        ],
      })
      .exec();

    return count > 0;
  }

  async OrderHasTruck(truckId: string): Promise<boolean> {
    const count = await this.orderModel
      .countDocuments({ truck: new Types.ObjectId(truckId) })
      .exec();

    return count > 0;
  }

  async OrderHasUser(userId: string): Promise<boolean> {
    const count = await this.orderModel
      .countDocuments({ user: new Types.ObjectId(userId) })
      .exec();

    return count > 0;
  }

  private get orderAggregationPipeline() {
    return [
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
    ];
  }
}
