import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UsersRepository, UsersMapper } from '../users.repository';
import { usersModel } from '../schema/user.schema';
import {
  UserRoleRelService,
  UserRoleRelationMapper,
} from '../../user-role-rel/user-role-rel.service';
import { userRoleRelModel } from '../../user-role-rel/schema/user-role-rel.schema';
import { RolesService } from '../../roles/roles.service';
import { RolesRepository, RolesMapper } from '../../roles/roles.repository';
import { rolesModel } from '../../roles/schema/role.schema';
import { UserForUpdate, User } from '../models/user.model';
import { establishDbConnection, closeDbConnection, sample } from '../../common';
import { getMockUsers } from './mock.data';

describe('Users Controller', () => {
  let usersController: UsersController;
  let mockUsers: User[];

  beforeAll(async () => {
    const rolesMapper = new RolesMapper();
    const rolesRepo = new RolesRepository(rolesModel, rolesMapper);
    const rolesService = new RolesService(rolesRepo);

    const roleRelMapper = new UserRoleRelationMapper();
    const userRoleRelService = new UserRoleRelService(userRoleRelModel, roleRelMapper);

    const usersMapper = new UsersMapper();
    const usersRepo = new UsersRepository(usersModel, usersMapper);
    const usersService = new UsersService(usersRepo, rolesService, userRoleRelService);

    usersController = new UsersController(usersService);
  });

  beforeAll(async () => {
    await establishDbConnection();
    mockUsers = await getMockUsers();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  describe('getAll', () => {
    it('should return list of users', async () => {
      const users = await usersController.getAll();
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const id = sample(mockUsers).id;

      const user = await usersController.findOne(id);
      expect(user.id).toBe(id);
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const mockUser = {
        username: 'user_name',
        password: 'password_123',
      };
      const roleId = 'role_id';

      const createdUser = await usersController.createUser(mockUser, roleId);
      expect(createdUser.username).toBe(mockUser.username);
      expect(createdUser.password).toBe(mockUser.password);
    });
  });

  describe('updateUser', () => {
    it('should update user by id', async () => {
      const id = sample(mockUsers).id;
      const patch: UserForUpdate = {
        password: 'pwd',
      };

      const updatedUser = await usersController.updateUser(id, patch);

      expect(updatedUser.id).toBe(id);
      expect(updatedUser.password).toBe(patch.password);
    });
  });

  describe('removeUser', () => {
    it('should remove user by id', async () => {
      const id = sample(mockUsers).id;

      const deletedUser = await usersController.removeUser(id);
      expect(deletedUser.isDeleted).toBe(true);
    });
  });
});
