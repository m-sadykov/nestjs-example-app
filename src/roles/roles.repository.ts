import {
  RoleForCreate,
  Role,
  RoleForUpdate,
  RoleDocument,
} from './models/role.model';
import { Inject } from '@nestjs/common';
import { ROLE_MODEL } from '../constants';
import { Model } from 'mongoose';

interface IRolesRepository {
  create(role: RoleForCreate): Promise<Role>;

  getAll(): Promise<Role[]>;

  findOne(id: string): Promise<Role>;

  findByName(name: string): Promise<Role>;

  update(id: string, patch: RoleForUpdate): Promise<Role>;

  delete(id: string): Promise<void>;
}

// TODO: implement error handling and remove throw error

export class RolesRepository implements IRolesRepository {
  constructor(@Inject(ROLE_MODEL) private readonly db: Model<RoleDocument>) {}

  async create(role: RoleForCreate): Promise<Role> {
    try {
      const result = new this.db(role);

      return result.save();
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Role[]> {
    try {
      return this.db.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Role> {
    try {
      const role = this.db.findById(id);

      if (!role) {
        throw Error(`Role with ${id} not found`);
      }

      return role;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<Role> {
    try {
      const [role] = await this.db.find(name);

      if (!role) {
        throw new Error(`Role with ${name} not found`);
      }

      return role;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, patch: RoleForUpdate): Promise<Role> {
    try {
      const role = await this.findOne(id);

      if (!role) {
        throw new Error(`Role with ${id} not found`);
      }

      await this.db.findByIdAndUpdate(id, patch, {
        new: true,
      });

      return role;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const role = await this.findOne(id);

      if (!role) {
        throw new Error(`Role with ${id} not found`);
      }

      await this.db.findByIdAndUpdate(id, { isDeleted: true });
    } catch (error) {
      throw error;
    }
  }
}
