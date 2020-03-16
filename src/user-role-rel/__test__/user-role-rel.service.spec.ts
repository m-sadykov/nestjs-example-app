import { UserRoleRelationMapper, UserRoleRelService } from '../user-role-rel.service';
import { userRoleRelModel } from '../schema/user-role-rel.schema';
import { getMockUserRoleRelations } from './mock.data';
import { establishDbConnection, closeDbConnection, sample, ObjectID } from '../../common';
import { UserRoleRelation, UserRoleRelationForCreate } from '../models/user-role-rel.model';
import {
  RoleRelationNotFoundError,
  RelationNotFoundError,
  RoleRelationAlreadyExistsError,
} from '../errors/errors';

describe('UserRoleRelations service', () => {
  let userRoleRelService: UserRoleRelService;
  let mockRelations: UserRoleRelation[];

  beforeEach(() => {
    const mapper = new UserRoleRelationMapper();
    userRoleRelService = new UserRoleRelService(userRoleRelModel, mapper);
  });

  beforeAll(async () => {
    await establishDbConnection();
    mockRelations = await getMockUserRoleRelations();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  describe('get', () => {
    it('should get all relations', async () => {
      const relations = await userRoleRelService.getAll();

      expect(relations.length).toBeGreaterThan(0);
    });

    it('should get specific relation by userId', async () => {
      const userId = sample(mockRelations).userId;

      const result = await userRoleRelService.getByAccount(userId);
      const relations = result.right();

      expect(relations.length).toBeGreaterThan(0);
      relations.every(relation => {
        expect(relation.userId).toBe(userId);
      });
    });

    it('should return "RoleRelationNotFoundError" in case if relation not found', async () => {
      const userId = new ObjectID().toHexString();

      const result = await userRoleRelService.getByAccount(userId);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleRelationNotFoundError);
    });
  });

  describe('create', () => {
    it('should create new relation', async () => {
      const rel: UserRoleRelationForCreate = {
        roleId: new ObjectID().toHexString(),
        userId: new ObjectID().toHexString(),
      };

      const result = await userRoleRelService.create(rel);
      const createdRel = result.right();

      expect(createdRel.roleId).toBe(rel.roleId);
      expect(createdRel.userId).toBe(rel.userId);
    });

    it('should return "RoleRelationAlreadyExistsError" if relation already exists', async () => {
      const existingRelation = sample(mockRelations);

      const result = await userRoleRelService.create(existingRelation);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleRelationAlreadyExistsError);
    });
  });

  describe('delete', () => {
    it('should remove specific relation by id', async () => {
      const id = sample(mockRelations).id;

      const result = await userRoleRelService.delete(id);
      const removedRelation = result.right();

      expect(removedRelation.isDeleted).toBe(true);
    });

    it('should return "RelationNotFoundError" if relation for delete not found', async () => {
      const id = new ObjectID().toHexString();

      const result = await userRoleRelService.delete(id);
      const error = result.left();

      expect(error).toBeInstanceOf(RelationNotFoundError);
    });
  });
});
