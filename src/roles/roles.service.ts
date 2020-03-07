import { Injectable } from '@nestjs/common';
import { RoleForCreate, Role, RoleForUpdate } from './models/role.model';
import { IRolesRepository, IRolesService } from './interfaces/interfaces';
import { RoleNotFoundError, RoleAlreadyExistsError } from './errors/errors';
import { Either, Left, Right } from 'monet';

@Injectable()
export class RolesService implements IRolesService {
  constructor(private readonly rolesRepo: IRolesRepository) {}

  async create(role: RoleForCreate): Promise<Either<RoleAlreadyExistsError, Role>> {
    const isRoleExists = await this.rolesRepo.isRoleAlreadyExists(role.name);

    if (isRoleExists) {
      return Left(new RoleAlreadyExistsError(role.name));
    }

    const createdRole = await this.rolesRepo.create(role);
    return Right(createdRole);
  }

  async getAll(): Promise<Role[]> {
    return this.rolesRepo.getAll();
  }

  async findOne(id: string): Promise<Either<RoleNotFoundError, Role>> {
    return this.rolesRepo.findOne(id);
  }

  async update(id: string, patch: RoleForUpdate): Promise<Either<RoleNotFoundError, Role>> {
    return this.rolesRepo.update(id, patch);
  }

  async delete(id: string): Promise<Either<RoleNotFoundError, Role>> {
    return this.rolesRepo.delete(id);
  }
}
