import { USER_MODEL } from './constants/constants';
import { Connection } from 'mongoose';
import { UserSchema } from './schema/user.schema';
import { DATABASE_CONNECTION } from '../database/constants';

export const usersProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema, 'identity-users'),
    inject: [DATABASE_CONNECTION],
  },
];
