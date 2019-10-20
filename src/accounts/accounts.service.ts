import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './interface/account';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
  ) {}

  async create(account): Promise<Account> {
    const createdAccount = new this.accountModel(account);
    return createdAccount.save();
  }

  async getAll(): Promise<Account[]> {
    return this.accountModel.find();
  }

  async findOne(id): Promise<Account> {
    return this.accountModel.findById(id);
  }

  async update(id, body): Promise<Account> {
    return this.accountModel.findByIdAndUpdate(id, body, {
      new: true,
    });
  }

  async delete(id): Promise<void> {
    return this.accountModel.findByIdAndUpdate(id, { isDeleted: true });
  }
}
