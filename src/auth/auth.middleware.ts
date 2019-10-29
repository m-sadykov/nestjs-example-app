import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

class IdentityAccessError extends Error {
  name: 'IdentityAccessError';

  constructor(message: string) {
    super(message);
  }
}

export type AuthenticatedRequest = {
  [key: string]: any;
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersSerice: UsersService) {}

  async use(req: AuthenticatedRequest, next: NextFunction) {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException();
    }

    try {
      const [username, password] = await this.getAuthorizationCredentials(
        authHeaders,
      );

      req.user = await this.usersSerice.validate(username, password);

      next();
    } catch (error) {
      await this.handleError(error);
    }
  }

  private async getAuthorizationCredentials(header: string) {
    const base64Credentials = header.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    );

    return credentials.split(':');
  }

  private async handleError(error: any) {
    const status = error.statusCode;

    if (status === 401) {
      throw new UnauthorizedException();
    } else {
      throw new IdentityAccessError(
        'Error on authenticate, something went wrong.',
      );
    }
  }
}
