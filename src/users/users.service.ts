import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import {
  BadRequestError,
  ConflictError,
  EntityNotFoundError,
} from 'src/shared/errors/errors';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserData } from './types/update-user-data.type';
import { PasswordHasher } from 'src/shared/security/password-hasher';
import { OrderRepository } from 'src/orders/order.repository';
import { TruckRepository } from 'src/trucks/truck.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    @Inject(forwardRef(() => OrderRepository))
    private readonly orderRepository: OrderRepository,
    @Inject(forwardRef(() => TruckRepository))
    private readonly truckRepository: TruckRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) throw new ConflictError('Email already exist');

    const hashedPassword = await this.passwordHasher.hash(
      createUserDto.password,
    );

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new EntityNotFoundError('User', id);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, password } = updateUserDto;
    const data: UpdateUserData = {};

    if (email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== id)
        throw new ConflictError('Email already exist');

      data.email = email;
    }

    if (password) data.password = await this.passwordHasher.hash(password);

    const updatedUser = await this.userRepository.update(id, data);

    if (!updatedUser) throw new EntityNotFoundError('User', id);

    console.log('updated:', updatedUser);

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    //hace control de si tiene camiones asociados
    //hace control de si tiene ordenes asociados

    const existInOrder = await this.orderRepository.OrderHasUser(id);
    console.log('existInOrder:', existInOrder);

    const existInTruck = await this.truckRepository.TruckHasUser(id);
    console.log('existInTruck:', existInTruck);

    if (existInOrder || existInTruck)
      throw new BadRequestError(
        'user id',
        'The User cannot be eliminated. It has one or more trucks/orders associated',
      );

    const deleted = await this.userRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('User', id);
  }
}
