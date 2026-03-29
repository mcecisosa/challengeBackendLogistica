import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'src/shared/errors/errors';
import { UserRepository } from 'src/users/user.repository';
import { OrderRepository } from './order.repository';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { TruckRepository } from 'src/trucks/truck.repository';
import { LocationRepository } from 'src/locations/location.repository';

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

  // async findAll(): Promise<TruckResponseDto[]> {
  //   const trucks = await this.truckRepository.findAll();

  //   return trucks.map((truck) => TruckResponseDto.fromEntity(truck));
  // }

  // async findById(id: string): Promise<TruckResponseDto> {
  //   const truck = await this.truckRepository.findById(id);

  //   if (!truck) throw new EntityNotFoundError('Truck', id);

  //   return TruckResponseDto.fromEntity(truck);
  // }

  // async update(
  //   id: string,
  //   updateTruckDto: UpdateTruckDto,
  // ): Promise<TruckResponseDto> {
  //   const { plates, user } = updateTruckDto;

  //   if (plates) {
  //     const existingTruck = await this.truckRepository.findByPlates(plates);
  //     if (existingTruck && existingTruck.id !== id)
  //       throw new ConflictError('Truck already exist');
  //   }
  //   if (user) {
  //     const existingUser = await this.userRepository.findById(user);
  //     if (!existingUser) throw new EntityNotFoundError('User', user);
  //   }

  //   const updatedTruck = await this.truckRepository.update(id, updateTruckDto);

  //   if (!updatedTruck) throw new EntityNotFoundError('Truck', id);

  //   return TruckResponseDto.fromEntity(updatedTruck);
  // }

  // async delete(id: string): Promise<void> {
  //   //TODO hacer control de si tiene ordenes asociados

  //   const deleted = await this.truckRepository.delete(id);

  //   if (!deleted) throw new EntityNotFoundError('Truck', id);
  // }
}
