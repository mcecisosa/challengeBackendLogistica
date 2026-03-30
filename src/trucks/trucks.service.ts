import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  BadRequestError,
  ConflictError,
  EntityNotFoundError,
} from 'src/shared/errors/errors';
import { TruckRepository } from './truck.repository';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { UserRepository } from 'src/users/user.repository';
import { OrderRepository } from 'src/orders/order.repository';
import { Truck } from './entities/truck.entity';

@Injectable()
export class TrucksService {
  constructor(
    private readonly truckRepository: TruckRepository,
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => OrderRepository))
    private readonly orderRepository: OrderRepository,
  ) {}
  //TruckResponseDto
  async create(createTruckDto: CreateTruckDto): Promise<Truck> {
    const { user } = createTruckDto;
    const existingUser = await this.userRepository.findById(user);

    if (!existingUser) throw new EntityNotFoundError('User', user);

    const existingTruck = await this.truckRepository.findByPlates(
      createTruckDto.plates,
    );

    if (existingTruck) throw new ConflictError('Tuck already exist');

    const newTruck = await this.truckRepository.create(createTruckDto);

    return newTruck; //TruckResponseDto.fromEntity(newTruck);
  }

  async findAll(): Promise<Truck[]> {
    const trucks = await this.truckRepository.findAll();
    return trucks;
  }

  async findById(id: string): Promise<Truck> {
    const truck = await this.truckRepository.findById(id);

    if (!truck) throw new EntityNotFoundError('Truck', id);

    return truck;
  }

  async update(id: string, updateTruckDto: UpdateTruckDto): Promise<Truck> {
    const { plates, user } = updateTruckDto;

    if (plates) {
      const existingTruck = await this.truckRepository.findByPlates(plates);
      if (existingTruck && existingTruck.id !== id)
        throw new ConflictError('Truck already exist');
    }
    if (user) {
      const existingUser = await this.userRepository.findById(user);
      if (!existingUser) throw new EntityNotFoundError('User', user);
    }

    const updatedTruck = await this.truckRepository.update(id, updateTruckDto);

    if (!updatedTruck) throw new EntityNotFoundError('Truck', id);

    return updatedTruck;
  }

  async delete(id: string): Promise<void> {
    //hace control de si tiene ordenes asociados
    const existInOrder = await this.orderRepository.OrderHasTruck(id);
    console.log('existInOrder:', existInOrder);

    if (existInOrder)
      throw new BadRequestError(
        'truck id',
        'The Truck cannot be eliminated. It has one or more orders associated',
      );

    const deleted = await this.truckRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('Truck', id);
  }
}
