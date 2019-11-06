import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

type MongooseModel = Model<any>;
@Injectable()
export class DatabaseService {
  async create(model: MongooseModel, body: any): Promise<any> {
    const creationResult = new model(body);
    return creationResult.save();
  }

  async getAll(model: MongooseModel): Promise<any[]> {
    return model.find();
  }

  async findOne(model: MongooseModel, id: string): Promise<any> {
    return model.findById(id);
  }

  async update(model: MongooseModel, id: string, body: any): Promise<any> {
    return model.findByIdAndUpdate(id, body, {
      new: true,
    });
  }

  async delete(model: MongooseModel, id: string): Promise<any> {
    return model.findByIdAndUpdate(id, { isDeleted: true });
  }
}
