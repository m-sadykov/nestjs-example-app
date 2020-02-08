import { ROLE_MODEL, DATABASE_CONNECTION } from '../constants';
import { Connection } from 'mongoose';
import { RoleSchema } from './schema/role.schema';

export const rolesProviders = [
  {
    provide: ROLE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Role', RoleSchema, 'identity-roles'),
    inject: [DATABASE_CONNECTION],
  },
];
