import * as request from 'request-promise-native';
import { ConfigService } from '../../config';
type Options = request.Options;
type Response = request.FullResponse;

const config = new ConfigService(process.env.NODE_ENV + '.env');
const url = config.get('URL');
const port = config.get('PORT');

export const authenticatedRequest = async (options: Options): Promise<Response> =>
  request({
    baseUrl: `${url}:${port}`,
    // use admin credentials to perform all api requests
    auth: {
      username: 'admin',
      password: '123',
    },
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    ...options,
  });
