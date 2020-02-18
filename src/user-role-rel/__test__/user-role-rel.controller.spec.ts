import 'reflect-metadata';
import { UserRoleRelation } from '../models/user-role-rel.model';
import { UserRoleRelController } from '../user-role-rel.controller';
import { IUserRoleRelService } from '../user-role-rel.service';

describe('UserRolRel Controller', () => {
  let userRoleRelController: UserRoleRelController;

  const userRoleRelService: IUserRoleRelService = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getByAccount: jest.fn(),
  };

  const relationsRepo = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    userRoleRelController = new UserRoleRelController(userRoleRelService);
  });

  describe('getAll', () => {
    it('should return list of user role relations', async () => {
      const mockRelation = getMockRelation();

      jest
        .spyOn(userRoleRelService, 'getAll')
        .mockImplementationOnce(async (): Promise<UserRoleRelation[]> => [mockRelation]);

      const relations = await userRoleRelController.getAll();
      expect(Array.isArray(relations)).toBe(true);
    });
  });

  describe('getUserRoleRelByAccountId', () => {
    it('should return relation by account id', async () => {
      const accountId = 'some_id';
      const mockRelation = getMockRelation();

      jest
        .spyOn(userRoleRelService, 'getByAccount')
        .mockImplementationOnce(async (): Promise<UserRoleRelation[]> => [mockRelation]);

      const relation = await userRoleRelController.getUserRoleRelByAccountId(accountId);
      expect(Array.isArray(relation)).toBe(true);
    });
  });

  describe('removeRel', () => {
    it('should remove relation by id', async () => {
      const id = 'some_id';
      const relForDelete: UserRoleRelation = {
        ...getMockRelation(),
        isDeleted: true,
      };

      relationsRepo.findById.mockImplementationOnce(() => undefined);

      jest.spyOn(userRoleRelService, 'delete').mockImplementationOnce(
        async (): Promise<UserRoleRelation> => {
          return Promise.resolve(relForDelete);
        },
      );

      const deletedRel = await userRoleRelController.removeRel(id);
      expect(deletedRel.isDeleted).toBe(true);
    });
  });

  const getMockRelation = (): UserRoleRelation => {
    return {
      id: 'id',
      userId: 'some_id',
      roleId: 'some_other_id',
      isDeleted: false,
    };
  };
});
