import { Role, RoleForCreate, RoleForUpdate } from './models/role.model';
import { Model } from 'mongoose';
import { RoleDocument } from './schema/role.schema';
import { IRolesMapper, IRolesRepository } from './interfaces/interfaces';
import { RoleNotFoundError } from './errors/errors';
import { Either, Left, Right } from 'monet';

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

  async findOne(id: string): Promise<Either<RoleNotFoundError, Role>> {
    const role = await this.database.findById(id);

    if (!role) {
      return Left(new RoleNotFoundError(id));
    }
    return Right(this.mapper.fromEntity(role));
  }

  async isRoleAlreadyExists(name: string): Promise<boolean> {
    const [role] = await this.database.find({ name });
    return role ? true : false;
  }

  async update(id: string, patch: RoleForUpdate): Promise<Either<RoleNotFoundError, Role>> {
    const role = await this.findOne(id);

    if (!role.isRight()) {
      return Left(new RoleNotFoundError(id));
    }

    const updated = await this.database.findByIdAndUpdate(id, patch, {
      new: true,
    });
    return Right(this.mapper.fromEntity(updated));
  }

  async delete(id: string): Promise<Either<RoleNotFoundError, Role>> {
    const role = await this.findOne(id);

    if (!role.isRight()) {
      return Left(new RoleNotFoundError(id));
    }

    const deleted = await this.database.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return Right(this.mapper.fromEntity(deleted));
  }
}
