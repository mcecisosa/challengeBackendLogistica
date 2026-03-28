import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UserDocument } from './schema/user.schema';
import { CreateUserData } from './types/create-user-data.type';

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
}
