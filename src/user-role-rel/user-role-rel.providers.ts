import { USER_ROLE_RELATION_MODEL } from './constants/constants';
import { Connection } from 'mongoose';
import { UserRoleRelSchema } from './schema/user-role-rel.schema';
import { DATABASE_CONNECTION } from '../database/constants';

export const userRoleRelProviders = [
  {
    provide: USER_ROLE_RELATION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(
        'UserRoleRel',
        UserRoleRelSchema,
        'identity-user-role-rels',
      ),
    inject: [DATABASE_CONNECTION],
  },
];
