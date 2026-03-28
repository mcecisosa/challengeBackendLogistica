import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UserDocument } from './schema/user.schema';
import { CreateUserData } from './types/create-user-data.type';
import { UpdateUserData } from './types/update-user-data.type';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserData: CreateUserData): Promise<User> {
    const newUser = new this.userModel(createUserData);

    const savedUser = await newUser.save();

    return new User(savedUser.id, savedUser.email, savedUser.password);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();

    if (!userDoc) return null;

    return new User(userDoc._id.toString(), userDoc.email, userDoc.password);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(
      (user) => new User(user._id.toString(), user.email, user.password),
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();

    if (!user) return null;

    return new User(user._id.toString(), user.email, user.password);
  }

  async update(
    id: string,
    updateUserData: UpdateUserData,
  ): Promise<User | null> {
    const updated = await this.userModel.findByIdAndUpdate(id, updateUserData, {
      new: true,
    });

    if (!updated) return null;

    return new User(updated.id, updated.email, updated.password);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();

    if (!deleted) return false;
    return true;
  }
}
