import { Role, RoleForCreate, RoleForUpdate } from '../models/role.model';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { RolesRepository, RolesMapper } from '../roles.repository';
import { rolesModel } from '../schema/role.schema';
import { establishDbConnection, closeDbConnection, sample } from '../../common';
import { getMockRoles } from './mock.data';

describe('Roles Controller', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;
  let mockRoles: Role[];

  beforeAll(async () => {
    await establishDbConnection();
    mockRoles = await getMockRoles();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  beforeEach(async () => {
    const mapper = new RolesMapper();
    const rolesRepository = new RolesRepository(rolesModel, mapper);
    rolesService = new RolesService(rolesRepository);

    rolesController = new RolesController(rolesService);
  });

  describe('getAll', () => {
    it('should return list of roles', async () => {
      const roles = await rolesController.getAll();

      expect(roles.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return role by id', async () => {
      const id = sample(mockRoles).id;

      const role = await rolesController.findOne(id);
      expect(role.id).toBe(id);
    });
  });

  describe('createRole', () => {
    it('should create new role', async () => {
      const mockRole: RoleForCreate = {
        name: 'test_role',
        displayName: 'TEST_ROLE',
        description: 'some_text',
      };

      const createdRole = await rolesController.createRole(mockRole);

      expect(createdRole.name).toBe(mockRole.name);
      expect(createdRole.displayName).toBe(mockRole.displayName);
      expect(createdRole.description).toBe(mockRole.description);
    });
  });

  describe('updateRole', () => {
    it('should update role by id', async () => {
      const id = sample(mockRoles).id;
      const patch: RoleForUpdate = {
        description: 'test description',
      };

      const updatedRole = await rolesController.updateRole(id, patch);

      expect(updatedRole.id).toBe(id);
      expect(updatedRole.description).toBe(patch.description);
    });
  });

  describe('removeRole', () => {
    it('should remove role by id', async () => {
      const id = sample(mockRoles).id;

      const roleForDelete = await rolesController.removeRole(id);
      expect(roleForDelete.isDeleted).toBe(true);
    });
  });
});
