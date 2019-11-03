import 'reflect-metadata';
import { AuthMiddleware, AuthenticatedRequest } from '../auth.middleware';

describe('Auth middleware', () => {
  const userService = {
    validate: jest.fn(),
  };
  const authMiddleware = new AuthMiddleware(userService as any);
  const response = {};
  const next = jest.fn();

  it('should modify request globally with authenticated user', async () => {
    const request: AuthenticatedRequest = {
      headers: {
        authorization:
          'Basic ' + Buffer.from(`username:password`).toString('base64'),
      },
    };

    userService.validate.mockResolvedValueOnce(
      Promise.resolve({
        username: 'username',
        roles: ['role'],
      }),
    );

    await authMiddleware.use(request, response as any, next);

    expect(request.user).toMatchObject({
      username: 'username',
      roles: ['role'],
    });
  });

  it('should throw Unauthorized exception if user has no authorization headers', async () => {
    const request: AuthenticatedRequest = {
      headers: {},
    };

    userService.validate.mockImplementationOnce(() => {
      return {
        statusCode: 401,
      };
    });

    try {
      await authMiddleware.use(request, response as any, next);
    } catch (error) {
      expect(error.status).toBe(401);
      expect(error.response).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
      });
    }
  });

  it('should throw Unauthorized exception if user provided wrong login or password', async () => {
    const request: AuthenticatedRequest = {
      headers: {
        authorization:
          'Basic ' + Buffer.from(`wronguser:wrongpassword`).toString('base64'),
      },
    };

    userService.validate.mockImplementationOnce(() => {
      return {
        statusCode: 401,
      };
    });

    try {
      await authMiddleware.use(request, response as any, next);
    } catch (error) {
      expect(error.status).toBe(401);
      expect(error.response).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
      });
    }
  });

  it('should throw Unauthorized exception if user does not exists in system', async () => {
    const request: AuthenticatedRequest = {
      headers: {
        authorization:
          'Basic ' + Buffer.from(`notexists:pwd`).toString('base64'),
      },
    };

    userService.validate.mockImplementationOnce(() => {
      return {
        statusCode: 401,
      };
    });

    try {
      await authMiddleware.use(request, response as any, next);
    } catch (error) {
      expect(error.status).toBe(401);
      expect(error.response).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
      });
    }
  });

  it('should throw an Error in case of error', async () => {
    const request: AuthenticatedRequest = {
      headers: {
        authorization: 'Basic ' + Buffer.from(`user:pwd`).toString('base64'),
      },
    };

    userService.validate.mockImplementationOnce(() => new Error());

    try {
      await authMiddleware.use(request, response as any, next);
    } catch (error) {
      expect(error.message).toBe(
        'Error on authenticate, something went wrong.',
      );
    }
  });
});
