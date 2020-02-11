import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import {
  UserRoleRelController,
  UserRoleRelationMapper,
} from '../user-role-rel.controller';
import { USER_ROLE_RELATION_MODEL } from '../../constants';
import { UserRoleRelation } from '../models/user-role-rel.model';
import { Schema } from 'mongoose';

const objectId = Schema.Types.ObjectId;

describe('UserRolRel Controller', () => {
  let userRoleRelController: UserRoleRelController;
  const relationsRepo = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserRoleRelController],
      providers: [
        UserRoleRelationMapper,
        {
          provide: USER_ROLE_RELATION_MODEL,
          useValue: relationsRepo,
        },
      ],
    }).compile();

    userRoleRelController = module.get<UserRoleRelController>(
      UserRoleRelController,
    );
  });

  describe('getAll', () => {
    it('should return list of user role relations', async () => {
      const mockRelation = getMockRelation();

      jest
        .spyOn(relationsRepo, 'find')
        .mockImplementationOnce(
          async (): Promise<UserRoleRelation[]> => [mockRelation],
        );

      const relations = await userRoleRelController.getAll();
      expect(Array.isArray(relations)).toBe(true);
    });
  });

  describe('getUserRoleRelByAccountId', () => {
    it('should return relation by account id', async () => {
      const accountId = 'some_id';
      const mockRelation = getMockRelation();

      jest
        .spyOn(relationsRepo, 'find')
        .mockImplementationOnce(
          async (): Promise<UserRoleRelation[]> => [mockRelation],
        );

      const relation = await userRoleRelController.getUserRoleRelByAccountId(
        accountId,
      );
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

      jest.spyOn(relationsRepo, 'findByIdAndUpdate').mockImplementationOnce(
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
      id: new objectId('id'),
      userId: 'some_id',
      roleId: 'some_other_id',
      isDeleted: false,
    };
  };
});
