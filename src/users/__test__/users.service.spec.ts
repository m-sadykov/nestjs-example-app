import { UsersService } from '../users.service';
import { UsersRepository, UsersMapper } from '../users.repository';
import { usersModel } from '../schema/user.schema';
import { RolesService } from '../../roles/roles.service';
import { RolesRepository, RolesMapper } from '../../roles/roles.repository';
import { rolesModel } from '../../roles/schema/role.schema';
import {
  UserRoleRelService,
  UserRoleRelationMapper,
} from '../../user-role-rel/user-role-rel.service';
import { userRoleRelModel } from '../../user-role-rel/schema/user-role-rel.schema';
import { establishDbConnection, closeDbConnection, sample } from '../../common';
import { User, UserForCreate } from '../models/user.model';
import { getMockUsers } from './mock.data';

describe('Users service', () => {
  let usersService: UsersService;
  let mockUsers: User[];

  beforeEach(() => {
    const rolesMapper = new RolesMapper();
    const rolesRepo = new RolesRepository(rolesModel, rolesMapper);
    const rolesService = new RolesService(rolesRepo);

    const roleRelMapper = new UserRoleRelationMapper();
    const userRoleRelService = new UserRoleRelService(userRoleRelModel, roleRelMapper);

    const usersMapper = new UsersMapper();
    const usersRepo = new UsersRepository(usersModel, usersMapper);

    usersService = new UsersService(usersRepo, rolesService, userRoleRelService);
  });

  beforeAll(async () => {
    await establishDbConnection();
    mockUsers = await getMockUsers();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it('should add admin user on module init', async () => {
    const result = await usersService.onModuleInit();

    expect(result).toMatchObject({
      username: 'admin',
      password: '123',
    });
  });

  it('should get all users', async () => {
    const users = await usersService.getAll();

    expect(users.length).toBeGreaterThan(0);
  });

  it('should get specific user by id', async () => {
    const id = sample(mockUsers).id;
    const user = await usersService.findOne(id);

    expect(user.id).toBe(id);
  });

  it('should get user credentials', async () => {
    const { username, password } = sample(mockUsers);

    const credentials = await usersService.getUserCredentials(username, password);
    const roles = credentials?.roles;

    expect(credentials?.username).toBe(username);
    expect(roles?.every(Boolean)).toBe(true);
  });

  it('should create new user', async () => {
    const userForCreate: UserForCreate = {
      username: 'test_user',
      password: 'pwd',
    };
    const roleId = 'mock_id';

    const user = await usersService.addUser(userForCreate, roleId);

    expect(user.username).toBe(userForCreate.username);
    expect(user.password).toBe(userForCreate.password);
  });

  it('should update specific user by id', async () => {
    const id = sample(mockUsers).id;
    const patch = {
      username: 'updated_user',
    };

    const updatedUser = await usersService.updateUser(id, patch);

    expect(updatedUser.id).toBe(id);
    expect(updatedUser.username).toBe(patch.username);
  });

  it('should remove specific user by id', async () => {
    const id = sample(mockUsers).id;
    const deletedUser = await usersService.removeUser(id);

    expect(deletedUser.isDeleted).toBe(true);
  });
});
