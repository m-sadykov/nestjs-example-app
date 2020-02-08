import { USER_MODEL, DATABASE_CONNECTION } from '../constants';
import { Connection } from 'mongoose';
import { UserSchema } from './schema/user.schema';

export const usersProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema, 'identity-users'),
    inject: [DATABASE_CONNECTION],
  },
];
