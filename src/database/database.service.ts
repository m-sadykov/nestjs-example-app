import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  async create(model, body): Promise<any> {
    const creationResult = new model(body);
    return creationResult.save();
  }

  async getAll(model): Promise<any[]> {
    return model.find();
  }

  async findOne(model, id): Promise<any> {
    return model.findById(id);
  }

  async update(model, id, body): Promise<any> {
    return model.findByIdAndUpdate(id, body, {
      new: true,
    });
  }

  async delete(model, id): Promise<any> {
    return model.findByIdAndUpdate(id, { isDeleted: true });
  }
}
