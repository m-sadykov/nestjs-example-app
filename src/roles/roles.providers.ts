import { ROLE_MODEL } from './constants/constants';
import { Connection } from 'mongoose';
import { RoleSchema } from './schema/role.schema';
import { DATABASE_CONNECTION } from '../database/constants';

export const rolesProviders = [
  {
    provide: ROLE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Role', RoleSchema, 'identity-roles'),
    inject: [DATABASE_CONNECTION],
  },
];
