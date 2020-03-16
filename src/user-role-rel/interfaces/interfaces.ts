import { UserRoleRelation, UserRoleRelationForCreate } from '../models/user-role-rel.model';
import { Either } from 'monet';
import {
  RoleRelationNotFoundError,
  RelationNotFoundError,
  RoleRelationAlreadyExistsError,
} from '../errors/errors';

export interface IUserRoleRelationMapper {
  fromEntity(entity: any): UserRoleRelation;
}

export interface IUserRoleRelService {
  getAll(): Promise<UserRoleRelation[]>;

  getByAccount(userId: string): Promise<Either<RoleRelationNotFoundError, UserRoleRelation[]>>;

  create(
    relation: UserRoleRelationForCreate,
  ): Promise<Either<RoleRelationAlreadyExistsError, UserRoleRelation>>;

  delete(id: string): Promise<Either<RelationNotFoundError, UserRoleRelation>>;
}
