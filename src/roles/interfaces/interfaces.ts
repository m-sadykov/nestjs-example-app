import { Role, RoleForCreate, RoleForUpdate } from '../models/role.model';
import { RoleNotFoundError, RoleAlreadyExistsError } from '../errors/errors';
import { Either } from 'monet';

export interface IRolesRepository {
  create(role: RoleForCreate): Promise<Role>;

  getAll(): Promise<Role[]>;

  findOne(id: string): Promise<Either<RoleNotFoundError, Role>>;

  isRoleAlreadyExists(name: string): Promise<boolean>;

  update(id: string, patch: RoleForUpdate): Promise<Either<RoleNotFoundError, Role>>;

  delete(id: string): Promise<Either<RoleNotFoundError, Role>>;
}

export interface IRolesMapper {
  fromEntity(entity: any): Role;
}

export interface IRolesService {
  create(role: RoleForCreate): Promise<Either<RoleAlreadyExistsError, Role>>;

  getAll(): Promise<Role[]>;

  findOne(id: string): Promise<Either<RoleNotFoundError, Role>>;

  update(id: string, patch: RoleForUpdate): Promise<Either<RoleNotFoundError, Role>>;

  delete(id: string): Promise<Either<RoleNotFoundError, Role>>;
}
