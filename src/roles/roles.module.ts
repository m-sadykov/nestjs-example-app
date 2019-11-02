import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { DatabaseService } from '../database/database.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { RolesService } from './roles.service';
import { rolesProviders } from './roles.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [RolesController],
  providers: [DatabaseService, RolesService, ...rolesProviders],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RolesController);
  }
}
