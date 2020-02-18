import { Role, RoleForCreate, RoleForUpdate } from './models/role.model';
import { Model } from 'mongoose';
import { RoleDocument } from './schema/role.schema';

export interface IRolesRepository {
  create(role: RoleForCreate): Promise<Role>;

  getAll(): Promise<Role[]>;

  findOne(id: string): Promise<Role>;

  isRoleAlreadyExists(name: string): Promise<boolean>;

  update(id: string, patch: RoleForUpdate): Promise<Role>;

  delete(id: string): Promise<Role>;
}

interface IRolesMapper {
  fromEntity(entity: any): Role;
}

export class RolesMapper implements IRolesMapper {
  fromEntity(entity: any): Role {
    return {
      id: entity._id.toString(),
      name: entity.name,
      description: entity.description,
      displayName: entity.displayName,
      isDeleted: entity.isDeleted,
    };
  }
}

// TODO: implement error handling and remove throw error

export class RolesRepository implements IRolesRepository {
  constructor(
    private readonly database: Model<RoleDocument>,
    private readonly mapper: IRolesMapper,
  ) {}

  async create(role: RoleForCreate): Promise<Role> {
    const createdRole = await this.database.create(role);

    return this.mapper.fromEntity(createdRole);
  }

  async getAll(): Promise<Role[]> {
    const roles = await this.database.find();

    return roles.map(this.mapper.fromEntity);
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.database.findById(id);

    if (!role) {
      throw Error(`Role with ${id} not found`);
    }

    return this.mapper.fromEntity(role);
  }

  async isRoleAlreadyExists(name: string): Promise<boolean> {
    const [role] = await this.database.find({ name });

    if (role) {
      return true;
    }

    return false;
  }

  async update(id: string, patch: RoleForUpdate): Promise<Role> {
    const role = await this.findOne(id);

    if (!role) {
      throw new Error(`Role with ${id} not found`);
    }

    const updated = await this.database.findByIdAndUpdate(id, patch, {
      new: true,
    });

    return this.mapper.fromEntity(updated);
  }

  async delete(id: string): Promise<Role> {
    const role = await this.findOne(id);

    if (!role) {
      throw new Error(`Role with ${id} not found`);
    }

    const deleted = await this.database.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    return this.mapper.fromEntity(deleted);
  }
}
