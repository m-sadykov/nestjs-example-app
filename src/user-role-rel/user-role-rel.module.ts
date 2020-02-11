import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import {
  UserRoleRelController,
  UserRoleRelationMapper,
} from './user-role-rel.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';
import { userRoleRelProviders } from './user-role-rel.providers';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [UserRoleRelController],
  providers: [UserRoleRelationMapper, ...userRoleRelProviders],
})
export class UserRoleRelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserRoleRelController);
  }
}
