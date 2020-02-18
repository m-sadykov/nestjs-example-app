import 'reflect-metadata';
import { Role } from '../models/role.model';
import { RolesController } from '../roles.controller';
import { IRolesService } from '../roles.service';

describe('Roles Controller', () => {
  let rolesController: RolesController;

  const rolesService: IRolesService = {
    create: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    rolesController = new RolesController(rolesService);
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

      jest.spyOn(rolesService, 'findOne').mockImplementationOnce((): any => mockRole);

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
      id: 'role_id',
      name: 'role',
      displayName: 'SOME_ROLE',
      description: 'some text',
      isDeleted: false,
    };
  };
});
