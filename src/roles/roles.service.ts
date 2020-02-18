import { Injectable } from '@nestjs/common';
import { RoleForCreate, Role, RoleForUpdate } from './models/role.model';
import { IRolesRepository } from './roles.repository';

export class RoleNotFoundError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'RoleNotFoundError';
  }
}

export class RoleAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Role with ${name} already exists`);

    this.name = 'RoleAlreadyExistsError';
  }
}

export interface IRolesService {
  create(role: RoleForCreate): Promise<Role>;

  getAll(): Promise<Role[]>;

  findOne(id: string): Promise<Role>;

  update(id: string, patch: RoleForUpdate): Promise<Role>;

  delete(id: string): Promise<Role>;
}

@Injectable()
export class RolesService implements IRolesService {
  constructor(private readonly rolesRepo: IRolesRepository) {}

  async create(role: RoleForCreate): Promise<Role> {
    const isRoleExists = await this.rolesRepo.isRoleAlreadyExists(role.name);

    if (isRoleExists) {
      throw new Error(`Role name ${role.name} already exists.`);
    }

    return this.rolesRepo.create(role);
  }

  async getAll(): Promise<Role[]> {
    return this.rolesRepo.getAll();
  }

  async findOne(id: string): Promise<Role> {
    return this.rolesRepo.findOne(id);
  }

  async update(id: string, patch: RoleForUpdate): Promise<Role> {
    return this.rolesRepo.update(id, patch);
  }

  async delete(id: string): Promise<Role> {
    return this.rolesRepo.delete(id);
  }
}
