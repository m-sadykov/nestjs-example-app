import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { USER_ROLE_RELATION_MODEL } from '../user-role-rel/constants/constants';
import { UserRoleRelSchema } from '../user-role-rel/schema/user-role-rel.schema';
import { ROLE_MODEL } from '../roles/constants/constants';
import { RoleSchema } from '../roles/schema/role.schema';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    DatabaseService,
    ...usersProviders,
    {
      provide: USER_ROLE_RELATION_MODEL,
      useValue: UserRoleRelSchema,
    },
    {
      provide: ROLE_MODEL,
      useValue: RoleSchema,
    },
  ],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
