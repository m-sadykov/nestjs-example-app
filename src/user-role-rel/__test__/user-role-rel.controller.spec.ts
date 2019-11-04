import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { UserRoleRelController } from '../user-role-rel.controller';
import { UserRoleRelService } from '../user-role-rel.service';
import { DatabaseService } from '../../database/database.service';
import { USER_ROLE_RELATION_MODEL } from '../constants/constants';
import { UserRoleRelSchema } from '../schema/user-role-rel.schema';

describe('UserRolRel Controller', () => {
  let userRoleRelController: UserRoleRelController;
  let userRoleRelService: UserRoleRelService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserRoleRelController],
      providers: [
        UserRoleRelService,
        DatabaseService,
        {
          provide: USER_ROLE_RELATION_MODEL,
          useValue: UserRoleRelSchema,
        },
      ],
    }).compile();

    userRoleRelController = module.get<UserRoleRelController>(
      UserRoleRelController,
    );
    userRoleRelService = module.get<UserRoleRelService>(UserRoleRelService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('getAll', () => {
    it('should return list of user role relations', async () => {
      const mockRelations = getMockRelation();

      jest
        .spyOn(databaseService, 'getAll')
        .mockImplementationOnce(
          (): any => [mockRelations, mockRelations, mockRelations],
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
        .spyOn(databaseService, 'findOne')
        .mockImplementationOnce((): any => mockRelation);

      const relation = await userRoleRelController.getUserRoleRelByAccountId(
        accountId,
      );
      expect(relation).toBe(mockRelation);
    });
  });

  describe('createUserRoleRel', () => {
    it('should create new relation', async () => {
      const relation = getMockRelation();

      jest
        .spyOn(userRoleRelService, 'isUserRoleRelAlreadyExists')
        .mockImplementationOnce((): Promise<boolean> => Promise.resolve(false));

      jest
        .spyOn(databaseService, 'create')
        .mockImplementationOnce((): any => relation);

      const createdRel = await userRoleRelController.createUserRoleRel(
        relation,
      );
      expect(createdRel).toBe(relation);
    });

    it('should return BadRequestException if relation is already exists', async () => {
      const relation = getMockRelation();

      jest
        .spyOn(userRoleRelService, 'isUserRoleRelAlreadyExists')
        .mockImplementationOnce((): Promise<boolean> => Promise.resolve(true));

      jest.spyOn(databaseService, 'create').mockImplementationOnce(
        (): any => {
          return {
            statusCode: 400,
          };
        },
      );

      try {
        await userRoleRelController.createUserRoleRel(relation);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.response).toMatchObject({
          statusCode: 400,
          error: 'Bad Request',
          message: `Relation with userId ${relation.userId} roleId ${
            relation.roleId
          } already exists.`,
        });
      }
    });
  });

  describe('removeRel', () => {
    it('should remove relation by id', async () => {
      const id = 'some_id';

      jest.spyOn(databaseService, 'delete').mockImplementationOnce(
        (): any => {
          return {
            statusCode: 200,
            body: {},
          };
        },
      );

      const deletionResult = await userRoleRelController.removeRel(id);
      expect(deletionResult.statusCode).toBe(200);
    });
  });

  const getMockRelation = () => {
    return {
      userId: 'some_id',
      roleId: 'some_other_id',
    };
  };
});
