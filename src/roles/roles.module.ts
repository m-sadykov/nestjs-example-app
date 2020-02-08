import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { RolesService } from './roles.service';
import { rolesProviders } from './roles.providers';
import { DatabaseModule } from '../database/database.module';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, ...rolesProviders],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RolesController);
  }
}
