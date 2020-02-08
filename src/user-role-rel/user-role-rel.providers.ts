import { USER_ROLE_RELATION_MODEL, DATABASE_CONNECTION } from '../constants';
import { Connection } from 'mongoose';
import { UserRoleRelSchema } from './schema/user-role-rel.schema';

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
