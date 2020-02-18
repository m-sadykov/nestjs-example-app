import { UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IUsersService } from '../users/users.service';

export type AuthenticatedRequest = {
  [key: string]: any;
};

export type Authenticate = (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction,
) => Promise<void>;

export function authenticate(usersService: IUsersService): Authenticate {
  return async (req, _, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException();
    }

    const [username, password] = await getAuthorizationCredentials(authHeaders);

    req.user = await usersService.validate(username, password);

    next();
  };
}

async function getAuthorizationCredentials(header: string) {
  const base64Credentials = header.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

  return credentials.split(':');
}
