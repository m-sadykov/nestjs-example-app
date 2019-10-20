import { Injectable } from '@nestjs/common';

@Injectable()
export class MongodDbService {
  async create(model, body): Promise<any> {
    const creattionResult = new model(body);
    return creattionResult.save();
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

  async delete(model, id): Promise<void> {
    return model.findByIdAndUpdate(id, { isDeleted: true });
  }
}
