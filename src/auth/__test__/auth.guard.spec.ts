import 'reflect-metadata';
import { AuthGuard } from '../auth.guard';
import { AuthenticatedRequest, authenticate as _authenticate } from '../auth.middleware';
import { Right } from 'monet';

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
  const roles = ['admin', 'guest'];

  let mockReflectorSpy: any = jest.fn();

  async function mockAuthenticateUserImplementationOnce(mockUser: any) {
    const request: AuthenticatedRequest = {
      headers: {
        authorization: 'Basic ' + Buffer.from('username:password').toString('base64'),
      },
    };

    mockReflectorSpy = jest.spyOn(reflector, 'get').mockReturnValueOnce(roles);

    context.switchToHttp.mockImplementationOnce(() => {
      return {
        getRequest: () => request,
      };
    });

    userService.getUserCredentials.mockResolvedValueOnce(Promise.resolve(Right(mockUser)));

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
    mockReflectorSpy.mockReset();
  });

  it('should return false if user has no roles assigned', async () => {
    const user = {
      username: 'username',
      roles: [],
    };

    await mockAuthenticateUserImplementationOnce(user);
    const canActivate = authGuard.canActivate(context as any);

    expect(canActivate).toBe(false);
    mockReflectorSpy.mockReset();
  });

  it('should return false if user has invalid roles assigned', async () => {
    const user = {
      username: 'username',
      roles: ['non_existing_role'],
    };

    await mockAuthenticateUserImplementationOnce(user);
    const canActivate = authGuard.canActivate(context as any);

    expect(canActivate).toBe(false);
    mockReflectorSpy.mockReset();
  });
});
