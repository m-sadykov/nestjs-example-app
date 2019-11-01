import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RolesController } from '../roles.controller';
import { MongoDbService } from '../../mongo-db.service';
import { RoleSchema } from '../schema/role.schema';
import { RolesService } from '../roles.service';

describe('Roles Controller', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;
  let mongoDbService: MongoDbService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        MongoDbService,
        RolesService,
        {
          provide: getModelToken('Role'),
          useValue: RoleSchema,
        },
      ],
    }).compile();

    rolesController = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
    mongoDbService = module.get<MongoDbService>(MongoDbService);
  });

  describe('getAll', () => {
    it('should return list of roles', async () => {
      const mockRole = getMockRole();

      jest
        .spyOn(mongoDbService, 'getAll')
        .mockImplementationOnce((): any => [mockRole, mockRole, mockRole]);

      const roles = await rolesController.getAll();
      expect(Array.isArray(roles)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return role by id', async () => {
      const id = 'some_id';
      const mockRole = getMockRole();

      jest
        .spyOn(mongoDbService, 'findOne')
        .mockImplementationOnce((): any => mockRole);

      const role = await rolesController.findOne(id);
      expect(role).toBe(mockRole);
    });
  });

  describe('createRole', () => {
    it('should create new role', async () => {
      const mockRole = getMockRole();

      jest
        .spyOn(rolesService, 'isRoleAlreadyExists')
        .mockImplementationOnce((): Promise<boolean> => Promise.resolve(false));

      jest
        .spyOn(mongoDbService, 'create')
        .mockImplementationOnce((): any => mockRole);

      const createdRole = await rolesController.createRole(mockRole);
      expect(createdRole).toBe(mockRole);
      // isRoleExists.mockReset();
    });

    it('should throw BadRequest exception if role is already exists', async () => {
      const mockRole = getMockRole();

      jest
        .spyOn(rolesService, 'isRoleAlreadyExists')
        .mockImplementationOnce((): Promise<boolean> => Promise.resolve(true));

      jest.spyOn(mongoDbService, 'create').mockImplementationOnce(
        (): any => {
          return {
            statusCode: 400,
          };
        },
      );

      try {
        await rolesController.createRole(mockRole);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.response).toMatchObject({
          statusCode: 400,
          error: 'Bad Request',
          message: `Role name ${mockRole.name} already exists.`,
        });
      }
    });
  });

  describe('updateRole', () => {
    it('should update role by id', async () => {
      const id = 'some_id';
      const mockRole = getMockRole();

      jest
        .spyOn(mongoDbService, 'update')
        .mockImplementationOnce((): any => mockRole);

      const updatedRole = await rolesController.updateRole(id, mockRole);
      expect(updatedRole).toBe(mockRole);
    });
  });

  describe('remoRole', () => {
    it('should remove role by id', async () => {
      const id = 'some_id';

      jest.spyOn(mongoDbService, 'delete').mockImplementationOnce(
        (): any => {
          return {
            statusCode: 200,
            body: {},
          };
        },
      );

      const deletionResult = await rolesController.removeRole(id);
      expect(deletionResult.statusCode).toBe(200);
    });
  });

  const getMockRole = () => {
    return {
      name: 'role',
      displayName: 'SOME_ROLE',
      description: 'some text',
    };
  };
});
