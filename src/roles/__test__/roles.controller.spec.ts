import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { RolesRepository, RolesMapper } from '../roles.repository';
import { RoleSchema } from '../schema/role.schema';
import { ROLE_MODEL } from '../../constants';
import { Role } from '../models/role.model';
import { Schema } from 'mongoose';

const objectId = Schema.Types.ObjectId;

describe('Roles Controller', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;
  let rolesRepository: RolesRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        RolesRepository,
        RolesMapper,
        {
          provide: ROLE_MODEL,
          useValue: RoleSchema,
        },
      ],
    }).compile();

    rolesController = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
    rolesRepository = module.get<RolesRepository>(RolesRepository);
  });

  describe('getAll', () => {
    it('should return list of roles', async () => {
      const mockRole = getMockRole();

      jest
        .spyOn(rolesService, 'getAll')
        .mockImplementationOnce(async (): Promise<Role[]> => [mockRole]);

      const roles = await rolesController.getAll();
      expect(Array.isArray(roles)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return role by id', async () => {
      const id = 'some_id';
      const mockRole = getMockRole();

      jest
        .spyOn(rolesService, 'findOne')
        .mockImplementationOnce((): any => mockRole);

      const role = await rolesController.findOne(id);
      expect(role).toBe(mockRole);
    });
  });

  describe('createRole', () => {
    it('should create new role', async () => {
      const mockRole = getMockRole();

      jest
        .spyOn(rolesService, 'create')
        .mockImplementationOnce(async (): Promise<Role> => mockRole);

      const createdRole = await rolesController.createRole(mockRole);
      expect(createdRole).toBe(mockRole);
    });

    it('should throw BadRequest exception if role is already exists', async () => {
      const mockRole = getMockRole();

      jest.spyOn(rolesService, 'create').mockImplementationOnce(
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
        .spyOn(rolesService, 'update')
        .mockImplementationOnce(async (): Promise<Role> => mockRole);

      const updatedRole = await rolesController.updateRole(id, mockRole);
      expect(updatedRole).toBe(mockRole);
    });
  });

  describe('removeRole', () => {
    it('should remove role by id', async () => {
      const id = 'some_id';
      const deletedRole = {
        ...getMockRole(),
        isDeleted: true,
      };

      jest.spyOn(rolesService, 'delete').mockImplementationOnce(
        (): Promise<Role> => {
          return Promise.resolve(deletedRole);
        },
      );

      const roleForDelete = await rolesController.removeRole(id);
      expect(roleForDelete.isDeleted).toBe(true);
    });
  });

  const getMockRole = (): Role => {
    return {
      id: new objectId('role_id'),
      name: 'role',
      displayName: 'SOME_ROLE',
      description: 'some text',
      isDeleted: false,
    };
  };
});
