import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRepository } from './user.repository';
import { ConflictError } from 'src/shared/errors/errors';

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

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
