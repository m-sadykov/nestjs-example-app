import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interface/user';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(user): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async getAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id): Promise<User> {
    return this.userModel.findById(id);
  }

  async update(id, body): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, body, {
      new: true,
    });
  }

  async delete(id): Promise<void> {
    return this.userModel.findByIdAndUpdate(id, { isDeleted: true });
  }
}
