import 'reflect-metadata';
import { UsersController } from '../users.controller';
import { IUsersService } from '../users.service';

describe('Users Controller', () => {
  let usersController: UsersController;

  const usersService: IUsersService = {
    addUser: jest.fn(),
    findOne: jest.fn(),
    getAll: jest.fn(),
    removeUser: jest.fn(),
    updateUser: jest.fn(),
    validate: jest.fn(),
  };

  beforeAll(async () => {
    usersController = new UsersController(usersService);
  });

  describe('getAll', () => {
    it('should return list of users', async () => {
      const mockUser = getMockUser();

      jest.spyOn(usersService, 'getAll').mockImplementationOnce((): any => [mockUser]);

      const users = await usersController.getAll();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const id = 'some_id';
      const mockUser = getMockUser();

      jest.spyOn(usersService, 'findOne').mockImplementationOnce((): any => mockUser);

      const user = await usersController.findOne(id);
      expect(user).toBe(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const mockUser = getMockUser();

      jest.spyOn(usersService, 'addUser').mockImplementationOnce((): any => mockUser);

      const createdUser = await usersController.createUser(mockUser);
      expect(createdUser).toBe(mockUser);
    });

    it('should return BadRequest Exception if user is already exists', async () => {
      const mockUser = getMockUser();

      jest.spyOn(usersService, 'addUser').mockImplementationOnce(
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

      jest.spyOn(usersService, 'updateUser').mockImplementationOnce((): any => user);

      const updatedUser = await usersController.updateUser(id, user);
      expect(updatedUser).toBe(user);
    });
  });

  describe('removeUser', () => {
    it('should remove user by id', async () => {
      const id = 'some_id';

      jest.spyOn(usersService, 'removeUser').mockImplementationOnce(
        (): any => {
          return {
            isDeleted: true,
          };
        },
      );

      const deletedUser = await usersController.removeUser(id);
      expect(deletedUser.isDeleted).toBe(true);
    });
  });

  const getMockUser = () => {
    return {
      username: 'user_name',
      password: 'password_123',
    };
  };
});
