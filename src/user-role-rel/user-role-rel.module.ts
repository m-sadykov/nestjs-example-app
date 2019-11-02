import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserRoleRelController } from './user-role-rel.controller';
import { UserRoleRelService } from './user-role-rel.service';
import { DatabaseService } from '../database/database.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';
import { userRoleRelProviders } from './user-role-rel.providers';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [UserRoleRelController],
  providers: [UserRoleRelService, DatabaseService, ...userRoleRelProviders],
})
export class UserRoleRelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserRoleRelController);
  }
}
