import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRepository } from './user.repository';
import { ConflictError, EntityNotFoundError } from 'src/shared/errors/errors';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserData } from './types/update-user-data.type';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) throw new ConflictError('Email already exist');

    const newUser = await this.userRepository.create(createUserDto);

    return UserResponseDto.fromEntity(newUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new EntityNotFoundError('User', id);

    return UserResponseDto.fromEntity(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { email, password } = updateUserDto;
    const data: UpdateUserData = {};

    if (email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== id)
        throw new ConflictError('Email already exist');

      data.email = email;
    }

    if (password) data.password = password; //TODO falta hasheo de password

    const updatedUser = await this.userRepository.update(id, data);

    if (!updatedUser) throw new EntityNotFoundError('User', id);

    console.log('updated:', updatedUser);

    return UserResponseDto.fromEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    //TODO hacer control de si tiene camiones asociados
    //TODO hacer control de si tiene ordenes asociados

    const deleted = await this.userRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('User', id);
  }
}
