import 'reflect-metadata';
import { UsersService } from '../users.service';
import { Test } from '@nestjs/testing';
import {
  USER_MODEL,
  ROLE_MODEL,
  USER_ROLE_RELATION_MODEL,
} from '../../constants';
import { AuthenticatedUser } from '../interface/user';

describe('Users Service', () => {
  let usersService: UsersService;

  const userModel = {
    find: jest.fn(),
    create: jest.fn(),
  };
  const roleModel = {
    create: jest.fn(),
    findById: jest.fn(),
  };
  const userRoleRel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  const isUserAlreadyExists = jest.fn();
  const createAdminUser = jest.fn();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_MODEL,
          useValue: userModel,
        },
        {
          provide: ROLE_MODEL,
          useValue: roleModel,
        },
        {
          provide: USER_ROLE_RELATION_MODEL,
          useValue: userRoleRel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('onModuleInit', () => {
    it('should create admin user on init if admin is not exists', async () => {
      const admin = {
        username: 'admin',
        password: 'pwd',
      };
      const role = {
        name: 'admin',
        displayName: 'ADMIN',
        description: 'admin role with access to all API routes',
      };

      const rel = getMockRel();

      isUserAlreadyExists.mockImplementationOnce(() => Promise.resolve(false));

      userModel.find.mockImplementationOnce(() => []);

      userModel.create.mockImplementationOnce(() => admin);
      roleModel.create.mockImplementationOnce(() => role);
      userRoleRel.create.mockImplementationOnce(() => rel);

      createAdminUser.mockImplementationOnce(() => admin);

      const createdAdmin = await usersService.onModuleInit();

      expect(createdAdmin).toBe(admin);
    });
  });

  describe('validate', () => {
    it('should validate if user exists', async () => {
      const user = getMockUser();
      const rel = getMockRel();
      const role = getMockRole();

      const authenticatedUser: AuthenticatedUser = {
        username: 'user_name',
        roles: ['role_name'],
      };

      userModel.find.mockImplementationOnce(() => [user]);
      userRoleRel.find.mockImplementationOnce(() => [rel]);
      roleModel.findById.mockImplementationOnce(() => role);

      const validatedUser = await usersService.validate(
        user.username,
        user.password,
      );

      expect(validatedUser).toMatchObject(authenticatedUser);
    });

    it('should throw Unauthorized exception if user not exists', async () => {
      const user = getMockUser();

      userModel.find.mockImplementationOnce(() => []);

      try {
        await usersService.validate(user.username, user.password);
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.response).toMatchObject({
          statusCode: 401,
          error: 'Unauthorized',
        });
      }
    });
  });

  describe('isUserAlreadyExists', () => {
    it('should return true if user is already exists', async () => {
      const username = 'user_name';
      const user = getMockUser();

      userModel.find.mockImplementationOnce(() => [user]);

      const isUserExists = await usersService.isUserAlreadyExists(username);

      expect(isUserExists).toBe(true);
    });

    it('should return false if user is not exists', async () => {
      const username = 'user_name';

      userModel.find.mockImplementationOnce(() => []);

      const isUserExists = await usersService.isUserAlreadyExists(username);

      expect(isUserExists).toBe(false);
    });
  });

  const getMockUser = () => {
    return {
      _id: 'some_id',
      username: 'user_name',
      password: 'pwd',
    };
  };

  const getMockRel = () => {
    return {
      _id: 'some_id',
      userId: 'user_id',
      roleId: 'role_id',
    };
  };

  const getMockRole = () => {
    return {
      _id: 'some_id',
      name: 'role_name',
    };
  };
});
