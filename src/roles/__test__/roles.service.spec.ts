import { RolesService } from '../roles.service';
import { establishDbConnection, closeDbConnection, sample } from '../../common';
import { Role, RoleForCreate, RoleForUpdate } from '../models/role.model';
import { getMockRoles } from './mock.data';
import { RolesRepository, RolesMapper } from '../roles.repository';
import { rolesModel } from '../schema/role.schema';
import * as faker from 'faker';

faker.seed(478);

describe('Roles service', () => {
  let rolesService: RolesService;
  let mockRoles: Role[];

  beforeAll(async () => {
    await establishDbConnection();
    mockRoles = await getMockRoles();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  beforeEach(() => {
    const mapper = new RolesMapper();
    const repository = new RolesRepository(rolesModel, mapper);

    rolesService = new RolesService(repository);
  });

  it('should create role', async () => {
    const mockRole: RoleForCreate = {
      name: faker.lorem.word(),
      displayName: faker.lorem.word().toUpperCase(),
      description: faker.lorem.sentence(),
    };

    const result = await rolesService.create(mockRole);

    expect(result.name).toBe(mockRole.name);
    expect(result.displayName).toBe(mockRole.displayName);
    expect(result.description).toBe(mockRole.description);
  });

  it('should get all roles', async () => {
    const roles = await rolesService.getAll();

    expect(roles.length).toBeGreaterThan(0);
  });

  it('should get specific role by id', async () => {
    const id = sample(mockRoles).id;

    const role = await rolesService.findOne(id);
    expect(role.id).toBe(id);
  });

  it('should update specific role by id', async () => {
    const id = sample(mockRoles).id;
    const patch: RoleForUpdate = {
      name: 'role_for_update',
      displayName: faker.lorem.word().toUpperCase(),
      description: faker.lorem.text(),
    };

    const updatedRole = await rolesService.update(id, patch);

    expect(updatedRole.name).toBe(patch.name);
    expect(updatedRole.displayName).toBe(patch.displayName);
    expect(updatedRole.description).toBe(patch.description);
  });

  it('should remove specific role by id', async () => {
    const id = sample(mockRoles).id;

    const result = await rolesService.delete(id);
    expect(result.isDeleted).toBe(true);
  });
});
