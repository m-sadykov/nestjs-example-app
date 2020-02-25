import { UserRoleRelation } from '../models/user-role-rel.model';
import { UserRoleRelController } from '../user-role-rel.controller';
import { UserRoleRelService, UserRoleRelationMapper } from '../user-role-rel.service';
import { userRoleRelModel } from '../schema/user-role-rel.schema';
import { establishDbConnection, closeDbConnection, sample } from '../../common';
import { getMockUserRoleRelations } from './mock.data';

describe('UserRolRel Controller', () => {
  let userRoleRelController: UserRoleRelController;
  let mockRelations: UserRoleRelation[];

  beforeEach(async () => {
    const mapper = new UserRoleRelationMapper();
    const userRoleRelService = new UserRoleRelService(userRoleRelModel, mapper);

    userRoleRelController = new UserRoleRelController(userRoleRelService);
  });

  beforeAll(async () => {
    await establishDbConnection();
    mockRelations = await getMockUserRoleRelations();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  describe('getAll', () => {
    it('should return list of user role relations', async () => {
      const relations = await userRoleRelController.getAll();

      expect(relations.length).toBeGreaterThan(0);
    });
  });

  describe('getUserRoleRelByUserId', () => {
    it('should return relation by account id', async () => {
      const userId = sample(mockRelations).userId;

      const relations = await userRoleRelController.getUserRoleRelByUserId(userId);

      expect(relations.length).toBeGreaterThan(0);
      expect(relations.every(Boolean)).toBe(true);
    });
  });

  describe('removeRel', () => {
    it('should remove relation by id', async () => {
      const id = sample(mockRelations).id;

      const deletedRel = await userRoleRelController.removeRel(id);
      expect(deletedRel.isDeleted).toBe(true);
    });
  });
});
