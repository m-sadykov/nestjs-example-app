import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

class IdentityAccessError extends Error {
  name: 'IdentityAccessError';

  constructor(message: string) {
    super(message);
  }
}

interface AuthenticatedRequest extends Request {
  user: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersSerice: UsersService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException();
    }

    try {
      const [username, password] = this.getAuthorizationCredentials(
        authHeaders,
      );

      req.user = await this.usersSerice.validate(username, password);

      next();
    } catch (error) {
      const status = error.statusCode;
      this.handleError(status);
    }
  }

  private getAuthorizationCredentials(header: string) {
    const base64Credentials = header.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    );

    return credentials.split(':');
  }

  private handleError(status: number) {
    if (status === 401) {
      throw new UnauthorizedException();
    } else if (status === 400) {
      throw new BadRequestException();
    } else {
      throw new IdentityAccessError(
        'Error on authenticate, something went wrong.',
      );
    }
  }
}
