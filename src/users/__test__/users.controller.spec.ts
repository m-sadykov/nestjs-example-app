import 'reflect-metadata';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { DatabaseService } from '../../database/database.service';
import { Test } from '@nestjs/testing';
import { USER_MODEL } from '../constants/constants';
import { UserSchema } from '../schema/user.schema';
import { ROLE_MODEL } from '../../roles/constants/constants';
import { RoleSchema } from '../../roles/schema/role.schema';
import { USER_ROLE_RELATION_MODEL } from '../../user-role-rel/constants/constants';
import { UserRoleRelSchema } from '../../user-role-rel/schema/user-role-rel.schema';

describe('Users Controller', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        DatabaseService,
        {
          provide: USER_MODEL,
          useValue: UserSchema,
        },
        {
          provide: ROLE_MODEL,
          useValue: RoleSchema,
        },
        {
          provide: USER_ROLE_RELATION_MODEL,
          useValue: UserRoleRelSchema,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('getAll', () => {
    it('should return list of users', async () => {
      const mockUser = getMockUser();

      jest
        .spyOn(databaseService, 'getAll')
        .mockImplementationOnce((): any => [mockUser]);

      const users = await usersController.getAll();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const id = 'some_id';
      const mockUser = getMockUser();

      jest
        .spyOn(databaseService, 'findOne')
        .mockImplementationOnce((): any => mockUser);

      const user = await usersController.findOne(id);
      expect(user).toBe(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const mockUser = getMockUser();

      jest
        .spyOn(usersService, 'isUserAlreadyExists')
        .mockImplementationOnce((): Promise<boolean> => Promise.resolve(false));

      jest
        .spyOn(databaseService, 'create')
        .mockImplementationOnce((): any => mockUser);

      const createdUser = await usersController.createUser(mockUser);
      expect(createdUser).toBe(mockUser);
    });

    it('should return BadRequest Exception if user is already exists', async () => {
      const mockUser = getMockUser();

      jest
        .spyOn(usersService, 'isUserAlreadyExists')
        .mockImplementationOnce((): Promise<boolean> => Promise.resolve(true));

      jest.spyOn(databaseService, 'create').mockImplementationOnce(
        (): any => {
          return {
            statusCode: 400,
          };
        },
      );

      try {
        await usersController.createUser(mockUser);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.response).toMatchObject({
          statusCode: 400,
          error: 'Bad Request',
          message: `User ${mockUser.username} already exists`,
        });
      }
    });
  });

  describe('updateUser', () => {
    it('should update user by id', async () => {
      const id = 'some_id';
      const user = getMockUser();

      jest
        .spyOn(databaseService, 'update')
        .mockImplementationOnce((): any => user);

      const updatedUser = await usersController.updateUser(id, user);
      expect(updatedUser).toBe(user);
    });
  });

  describe('removeUser', () => {
    it('should remove user by id', async () => {
      const id = 'some_id';

      jest.spyOn(databaseService, 'delete').mockImplementationOnce(
        (): any => {
          return {
            statusCode: 200,
            body: {},
          };
        },
      );

      const deletionResult = await usersController.removeUser(id);
      expect(deletionResult.statusCode).toBe(200);
    });
  });

  const getMockUser = () => {
    return {
      username: 'user_name',
      password: 'password_123',
    };
  };
});
