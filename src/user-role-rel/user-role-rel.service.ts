import { Injectable } from '@nestjs/common';
import { UserRoleRelation, UserRoleRelationForCreate } from './models/user-role-rel.model';
import { Model } from 'mongoose';
import { UserRoleRelDocument } from './schema/user-role-rel.schema';
import { IUserRoleRelationMapper, IUserRoleRelService } from './interfaces/interfaces';
import { Either, Left, Right } from 'monet';
import { RoleRelationNotFoundError, RelationNotFoundError } from './errors/errors';

export class UserRoleRelationMapper implements IUserRoleRelationMapper {
  fromEntity(entity: any): UserRoleRelation {
    return {
      id: entity._id.toString(),
      roleId: entity.roleId,
      userId: entity.userId,
      isDeleted: entity.isDeleted,
    };
  }
}

@Injectable()
export class UserRoleRelService implements IUserRoleRelService {
  constructor(
    private readonly relationModel: Model<UserRoleRelDocument>,
    private readonly mapper: IUserRoleRelationMapper,
  ) {}

  async create(relation: UserRoleRelationForCreate): Promise<UserRoleRelation> {
    const created = await this.relationModel.create(relation);
    return this.mapper.fromEntity(created);
  }

  async getAll(): Promise<UserRoleRelation[]> {
    const relations = await this.relationModel.find();
    return relations.map(this.mapper.fromEntity);
  }

  async getByAccount(
    userId: string,
  ): Promise<Either<RoleRelationNotFoundError, UserRoleRelation[]>> {
    const relations = await this.relationModel.find({ userId });

    if (!relations.length) {
      return Left(new RoleRelationNotFoundError(userId));
    }
    return Right(relations.map(this.mapper.fromEntity));
  }

  async delete(id: string): Promise<Either<RelationNotFoundError, UserRoleRelation>> {
    const userRoleRel = await this.relationModel.findById(id);

    if (!userRoleRel) {
      return Left(new RelationNotFoundError(id));
    }

    const deleted = await this.relationModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    return Right(this.mapper.fromEntity(deleted));
  }
}
