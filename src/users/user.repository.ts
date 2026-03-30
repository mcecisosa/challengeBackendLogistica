import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UserDocument } from './schema/user.schema';
import { CreateUserData } from './types/create-user-data.type';
import { UpdateUserData } from './types/update-user-data.type';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserData: CreateUserData): Promise<User> {
    const newUser = new this.userModel(createUserData);

    const savedUser = await newUser.save();

    return UserMapper.toEntity(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();

    if (!userDoc) return null;

    return UserMapper.toEntity(userDoc);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => UserMapper.toEntity(user));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();

    if (!user) return null;

    return UserMapper.toEntity(user);
  }

  async update(
    id: string,
    updateUserData: UpdateUserData,
  ): Promise<User | null> {
    const updated = await this.userModel.findByIdAndUpdate(id, updateUserData, {
      new: true,
    });

    if (!updated) return null;

    return UserMapper.toEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();

    if (!deleted) return false;
    return true;
  }
}
