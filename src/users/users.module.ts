import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { rolesProviders } from '../roles/roles.providers';
import { userRoleRelProviders } from '../user-role-rel/user-role-rel.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    DatabaseService,
    ...usersProviders,
    ...rolesProviders,
    ...userRoleRelProviders,
  ],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
