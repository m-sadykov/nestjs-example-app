import 'reflect-metadata';
import { AuthGuard } from '../auth.guard';
import { AuthenticatedRequest, authenticate as _authenticate } from '../auth.middleware';

describe('Auth Guard', () => {
  const reflector = {
    get: jest.fn(),
  };
  const authGuard = new AuthGuard(reflector as any);
  const userService = {
    getUserCredentials: jest.fn(),
  };
  const authenticate = _authenticate(userService as any);
  const response = {};
  const next = jest.fn();
  const context = {
    getHandler: jest.fn(),
    switchToHttp: jest.fn(),
  };
  const roles = ['admin', 'reader', 'writer'];

  let mockGetHandler = jest.fn();

  async function mockAuthenticateUserImplementationOnce(mockUser: any) {
    const request: AuthenticatedRequest = {
      headers: {
        authorization: 'Basic ' + Buffer.from('username:password').toString('base64'),
      },
    };

    mockGetHandler = jest.spyOn(reflector, 'get').mockReturnValueOnce(roles);

    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => request,
      };
    });

    userService.getUserCredentials.mockResolvedValueOnce(Promise.resolve(mockUser));

    await authenticate(request, response as any, next);
  }

  it('should return true if user has roles assigned', async () => {
    const user = {
      username: 'username',
      roles: ['admin'],
    };

    await mockAuthenticateUserImplementationOnce(user);
    const canActivate = authGuard.canActivate(context as any);

    expect(canActivate).toBe(true);
    mockGetHandler.mockReset();
  });

  it('should return false if user has no roles assigned', async () => {
    const user = {
      username: 'username',
      roles: [],
    };

    await mockAuthenticateUserImplementationOnce(user);
    const canActivate = authGuard.canActivate(context as any);

    expect(canActivate).toBe(false);
    mockGetHandler.mockReset();
  });

  it('should return false if user has invalid roles assigned', async () => {
    const user = {
      username: 'username',
      roles: ['guest'],
    };

    await mockAuthenticateUserImplementationOnce(user);
    const canActivate = authGuard.canActivate(context as any);

    expect(canActivate).toBe(false);
    mockGetHandler.mockReset();
  });
});
