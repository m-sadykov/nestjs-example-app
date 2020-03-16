import { closeDbConnection, establishDbConnection, sample, ObjectID } from '../../common';
import {
  RolesMapper,
  rolesModel,
  RolesRepository,
  RolesService,
  RoleNotFoundError,
} from '../../roles';
import {
  UserRoleRelationMapper,
  userRoleRelModel,
  UserRoleRelService,
  RoleRelationNotFoundError,
} from '../../user-role-rel';
import { User, UserForCreate } from '../models/user.model';
import { usersModel } from '../schema/user.schema';
import { UsersMapper, UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { getMockUsers } from './mock.data';
import { UserNotFoundError, UserAlreadyExistsError } from '../errors/errors';
import { Left } from 'monet';

describe('Users service', () => {
  let usersService: UsersService;
  let userRoleRelService: UserRoleRelService;
  let rolesService: RolesService;
  let mockUsers: User[];

  beforeEach(() => {
    const rolesMapper = new RolesMapper();
    const rolesRepo = new RolesRepository(rolesModel, rolesMapper);
    rolesService = new RolesService(rolesRepo);

    const roleRelMapper = new UserRoleRelationMapper();
    userRoleRelService = new UserRoleRelService(userRoleRelModel, roleRelMapper);

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

  describe('On module init', () => {
    it('should add admin user on module init', async () => {
      await usersService.onModuleInit();

      const [result] = await usersService.getAll({ username: 'admin' });

      expect(result).toMatchObject({
        username: 'admin',
        password: '123',
      });
    });
  });

  describe('get', () => {
    it('should get all users', async () => {
      const users = await usersService.getAll();

      expect(users.length).toBeGreaterThan(0);
    });

    it('should get specific user by id', async () => {
      const id = sample(mockUsers).id;
      const result = await usersService.findOne(id);
      const user = result.right();

      expect(user.id).toBe(id);
    });

    it('should return "UserNotFoundError" if user not found', async () => {
      const id = new ObjectID().toHexString();

      const result = await usersService.findOne(id);
      const error = result.left();

      expect(error).toBeInstanceOf(UserNotFoundError);
    });

    it('should get user credentials', async () => {
      const { username, password } = sample(mockUsers);

      const result = await usersService.getUserCredentials(username, password);
      const credentials = result.right();
      const roles = credentials.roles;

      expect(credentials.username).toBe(username);
      expect(roles.length).toBeGreaterThan(0);
    });

    it('should return "RoleRelationNotFoundError" if relation to get credentials not found', async () => {
      const { username, password } = sample(mockUsers);
      const id = new ObjectID().toHexString();

      jest
        .spyOn(userRoleRelService, 'getByAccount')
        .mockImplementationOnce(async () => Left(new RoleRelationNotFoundError(id)));

      const result = await usersService.getUserCredentials(username, password);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleRelationNotFoundError);
    });

    it('should return "RoleNotFoundError" if role to get credentials not found', async () => {
      const { username, password } = sample(mockUsers);
      const id = new ObjectID().toHexString();

      jest
        .spyOn(rolesService, 'findOne')
        .mockImplementationOnce(async () => Left(new RoleNotFoundError(id)));

      const result = await usersService.getUserCredentials(username, password);
      const error = result.left();

      expect(error).toBeInstanceOf(RoleNotFoundError);
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const userForCreate: UserForCreate = {
        username: 'test_user',
        password: 'pwd',
      };

      const result = await usersService.addUser(userForCreate);
      const user = result.right();

      expect(user.username).toBe(userForCreate.username);
      expect(user.password).toBe(userForCreate.password);
    });

    it('should return "UserAlreadyExistsError" if user already exists', async () => {
      const existingUser = sample(mockUsers);

      const result = await usersService.addUser(existingUser);
      const error = result.left();

      expect(error).toBeInstanceOf(UserAlreadyExistsError);
    });
  });

  describe('update', () => {
    it('should update specific user by id', async () => {
      const id = sample(mockUsers).id;
      const patch = {
        username: 'updated_user',
      };

      const result = await usersService.updateUser(id, patch);
      const updatedUser = result.right();

      expect(updatedUser.id).toBe(id);
      expect(updatedUser.username).toBe(patch.username);
    });

    it('should return "UserNotFoundError" if user for update not found', async () => {
      const id = new ObjectID().toHexString();
      const patch = {
        username: 'updated_user',
      };

      const result = await usersService.updateUser(id, patch);
      const error = result.left();

      expect(error).toBeInstanceOf(UserNotFoundError);
    });
  });

  describe('delete', () => {
    it('should remove specific user by id', async () => {
      const id = sample(mockUsers).id;

      const result = await usersService.removeUser(id);
      const deletedUser = result.right();

      expect(deletedUser.isDeleted).toBe(true);
    });

    it('should return "UserNotFoundError" if user for delete not found', async () => {
      const id = new ObjectID().toHexString();

      const result = await usersService.removeUser(id);
      const error = result.left();

      expect(error).toBeInstanceOf(UserNotFoundError);
    });
  });
});
