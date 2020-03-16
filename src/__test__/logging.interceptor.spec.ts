import { LoggingInterceptor } from './../logging.interceptor';
import { createLogger } from 'winston';
import * as faker from 'faker';
import { throwError } from 'rxjs';

describe('Logging interceptor', () => {
  const request = { url: faker.internet.url(), method: 'PUT' };
  const context: any = {
    getHandler: jest.fn(),
    switchToHttp: () => ({ getRequest: () => request }),
  };

  const logger = createLogger({ silent: true });
  const interceptor = new LoggingInterceptor(logger);
  const log = jest.spyOn(logger, 'error');

  it('should log error and throw internal server error in case of exception', async () => {
    const errorMessage = 'Some error happened';
    const next: any = {
      handle: () => throwError(new Error(errorMessage)), // unhandled exception
    };

    interceptor.intercept(context, next).subscribe({
      error(err) {
        expect(err.response.statusCode).toBe(500);
        expect(err.response.message).toBe('Internal Server Error');
      },
    });

    const logData: any = log.mock.calls[0][0];

    expect(logData.url).toBe(request.url);
    expect(logData.method).toBe(request.method);
    expect(logData.message).toBe(errorMessage);
    expect(logData.stack).toBeTruthy();
  });
});
