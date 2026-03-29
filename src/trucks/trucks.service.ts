import { Injectable } from '@nestjs/common';
import { ConflictError, EntityNotFoundError } from 'src/shared/errors/errors';
import { TruckRepository } from './truck.repository';
import { CreateTruckDto } from './dto/create-truck.dto';
import { TruckResponseDto } from './dto/truck-response.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class TrucksService {
  constructor(
    private readonly truckRepository: TruckRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createTruckDto: CreateTruckDto): Promise<TruckResponseDto> {
    const { user } = createTruckDto;
    const existingUser = await this.userRepository.findById(user);

    if (!existingUser) throw new EntityNotFoundError('User', user);

    const existingTruck = await this.truckRepository.findByPlates(
      createTruckDto.plates,
    );

    if (existingTruck) throw new ConflictError('Tuck already exist');

    const newTruck = await this.truckRepository.create(createTruckDto);

    return TruckResponseDto.fromEntity(newTruck);
  }

  async findAll(): Promise<TruckResponseDto[]> {
    const trucks = await this.truckRepository.findAll();

    return trucks.map((truck) => TruckResponseDto.fromEntity(truck));
  }

  async findById(id: string): Promise<TruckResponseDto> {
    const truck = await this.truckRepository.findById(id);

    if (!truck) throw new EntityNotFoundError('Truck', id);

    return TruckResponseDto.fromEntity(truck);
  }

  async update(
    id: string,
    updateTruckDto: UpdateTruckDto,
  ): Promise<TruckResponseDto> {
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

    return TruckResponseDto.fromEntity(updatedTruck);
  }

  async delete(id: string): Promise<void> {
    //TODO hacer control de si tiene ordenes asociados

    const deleted = await this.truckRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('Truck', id);
  }
}
