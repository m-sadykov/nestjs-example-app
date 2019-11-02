import { ACCOUNT_MODEL } from './constants/constants';
import { Connection } from 'mongoose';
import { AccountSchema } from './schema/account.schema';
import { DATABASE_CONNECTION } from '../database/constants';

export const accountsProviders = [
  {
    provide: ACCOUNT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Account', AccountSchema, 'accounts'),
    inject: [DATABASE_CONNECTION],
  },
];
