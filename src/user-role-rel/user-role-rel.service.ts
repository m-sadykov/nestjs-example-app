import { Injectable } from '@nestjs/common';
import { UserRoleRelation, UserRoleRelationForCreate } from './models/user-role-rel.model';
import { Model } from 'mongoose';
import { UserRoleRelDocument } from './schema/user-role-rel.schema';
import { IUserRoleRelationMapper, IUserRoleRelService } from './interfaces/interfaces';
import { Either, Left, Right } from 'monet';
import {
  RoleRelationNotFoundError,
  RelationNotFoundError,
  RoleRelationAlreadyExistsError,
} from './errors/errors';

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

  private async checkExistence(relation: UserRoleRelationForCreate): Promise<boolean> {
    const relations = await this.relationModel.find({
      roleId: relation.roleId,
      userId: relation.userId,
    });
    return relations.length ? true : false;
  }

  async create(
    relation: UserRoleRelationForCreate,
  ): Promise<Either<RoleRelationAlreadyExistsError, UserRoleRelation>> {
    const isRelationExists = await this.checkExistence(relation);

    if (isRelationExists) {
      return Left(new RoleRelationAlreadyExistsError(relation.roleId));
    }

    const created = await this.relationModel.create(relation);
    return Right(this.mapper.fromEntity(created));
  }

  async getAll(): Promise<UserRoleRelation[]> {
    const relations = await this.relationModel.find();
    return relations.map(this.mapper.fromEntity);
  }

  async getByAccount(id: string): Promise<Either<RoleRelationNotFoundError, UserRoleRelation[]>> {
    const relations = await this.relationModel.find({ userId: id });

    if (!relations.length) {
      return Left(new RoleRelationNotFoundError(id));
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
