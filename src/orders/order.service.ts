import { Injectable } from '@nestjs/common';
import { BadRequestError, EntityNotFoundError } from 'src/shared/errors/errors';
import { UserRepository } from 'src/users/user.repository';
import { OrderRepository } from './order.repository';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { TruckRepository } from 'src/trucks/truck.repository';
import { LocationRepository } from 'src/locations/location.repository';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStatusOrderDto } from './dto/update-status.dto';
import { OrderStatus } from './types/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly truckRepository: TruckRepository,
    private readonly locationRepository: LocationRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { user, truck, pickup, dropoff } = createOrderDto;
    const existingUser = await this.userRepository.findById(user);
    if (!existingUser) throw new EntityNotFoundError('User', user);

    const existingTruck = await this.truckRepository.findById(truck);
    if (!existingTruck) throw new EntityNotFoundError('Truck', truck);

    const existingPickup = await this.locationRepository.findById(pickup);
    if (!existingPickup)
      throw new EntityNotFoundError('Pickup location', pickup);

    const existingDropoff = await this.locationRepository.findById(dropoff);
    if (!existingDropoff)
      throw new EntityNotFoundError('Dropoff location', dropoff);

    const newOrder = await this.orderRepository.create(createOrderDto);

    console.log('newOrder del SERVICE:', newOrder);

    return newOrder;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.findAll();

    return orders;
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new EntityNotFoundError('Order', id);

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { user, truck, pickup, dropoff } = updateOrderDto;

    if (user) {
      const existingUser = await this.userRepository.findById(user);
      if (!existingUser) throw new EntityNotFoundError('User', user);
    }

    if (truck) {
      const existingTruck = await this.truckRepository.findById(truck);
      if (!existingTruck) throw new EntityNotFoundError('Truck', truck);
    }

    if (pickup) {
      const existingLocation = await this.locationRepository.findById(pickup);
      if (!existingLocation)
        throw new EntityNotFoundError('Location pickup', pickup);
    }

    if (dropoff) {
      const existingLocation = await this.locationRepository.findById(dropoff);
      if (!existingLocation)
        throw new EntityNotFoundError('Location dropoff', dropoff);
    }

    const updatedOrder = await this.orderRepository.update(id, updateOrderDto);

    if (!updatedOrder) throw new EntityNotFoundError('Order', id);

    return updatedOrder;
  }

  async updateStatus(
    id: string,
    updateStatusOrderDto: UpdateStatusOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new EntityNotFoundError('Order', id);

    //control transicion estados
    if (
      order.status === OrderStatus.CREATED &&
      updateStatusOrderDto.status !== OrderStatus.IN_TRANSIT
    )
      throw new BadRequestError(
        'status',
        `Order with status ${OrderStatus.CREATED} only can chage to ${OrderStatus.IN_TRANSIT}`,
      );

    if (
      order.status === OrderStatus.IN_TRANSIT &&
      updateStatusOrderDto.status !== OrderStatus.COMPLETED
    )
      throw new BadRequestError(
        'status',
        `Order with status ${OrderStatus.IN_TRANSIT} only can chage to ${OrderStatus.COMPLETED}`,
      );

    if (order.status === OrderStatus.COMPLETED)
      throw new BadRequestError(
        'status',
        `Order with status ${OrderStatus.COMPLETED} cannot be changed`,
      );

    const updatedOrder = await this.orderRepository.updateStatus(
      id,
      updateStatusOrderDto,
    );

    if (!updatedOrder) throw new EntityNotFoundError('Order', id);

    return updatedOrder;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.orderRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('Order', id);
  }
}
