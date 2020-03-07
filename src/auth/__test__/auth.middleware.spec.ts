import 'reflect-metadata';
import { authenticate as _authenticate, AuthenticatedRequest } from '../auth.middleware';
import { Right, Left } from 'monet';

describe('Auth middleware', () => {
  const userService = {
    getUserCredentials: jest.fn(),
  };
  const authenticate = _authenticate(userService as any);
  const response = {};
  const next = jest.fn();

  it('should modify request globally with authenticated user', async () => {
    const request: AuthenticatedRequest = {
      headers: {
        authorization: 'Basic ' + Buffer.from(`username:password`).toString('base64'),
      },
    };

    jest.spyOn(userService, 'getUserCredentials').mockImplementationOnce(async () =>
      Right(
        (request.user = {
          username: 'username',
          roles: ['role'],
        }),
      ),
    );

    await authenticate(request, response as any, next);

    expect(request.user).toMatchObject({
      username: 'username',
      roles: ['role'],
    });
  });

  it('should throw Unauthorized exception if user has no authorization headers', async () => {
    const request: AuthenticatedRequest = {
      headers: {},
    };

    jest.spyOn(userService, 'getUserCredentials').mockImplementationOnce(async () =>
      Right(
        (request.user = {
          username: 'username',
          roles: ['role'],
        }),
      ),
    );

    try {
      await authenticate(request, response as any, next);
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
        authorization: 'Basic ' + Buffer.from(`wronguser:wrongpassword`).toString('base64'),
      },
    };

    jest.spyOn(userService, 'getUserCredentials').mockImplementationOnce(async () =>
      Left(
        (request.user = {
          username: 'username',
          roles: ['role'],
        }),
      ),
    );

    try {
      await authenticate(request, response as any, next);
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
        authorization: 'Basic ' + Buffer.from(`notexists:pwd`).toString('base64'),
      },
    };

    jest.spyOn(userService, 'getUserCredentials').mockImplementationOnce(async () =>
      Left(
        (request.user = {
          username: 'username',
          roles: ['role'],
        }),
      ),
    );

    try {
      await authenticate(request, response as any, next);
    } catch (error) {
      expect(error.status).toBe(401);
      expect(error.response).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
      });
    }
  });
});
