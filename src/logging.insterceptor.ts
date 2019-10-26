import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Logger } from 'winston';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LogginInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(this.logSuccess.bind(this, request)),
      catchError(error => {
        const isHandled = Boolean(error.statusCode);

        if (isHandled) {
          this.logSuccess(request);
        } else {
          this.logError(request, error);
        }

        return throwError(error);
      }),
    );
  }

  private logSuccess(request: Request) {
    this.logger.info({
      req: this.requestToJSON(request),
    });
  }

  private logError(request: Request, error: Error) {
    this.logger.error({
      req: this.requestToJSON(request),
      error: error.message,
    });
  }

  private requestToJSON(request: Request) {
    const { method, originalUrl: url, headers } = request;

    return { method, url, headers };
  }
}
