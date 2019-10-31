import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schema/role.schema';
import { RolesController } from './roles.controller';
import { MongoDbService } from '../mongo-db.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { RolesService } from './roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    UsersModule,
  ],
  controllers: [RolesController],
  providers: [MongoDbService, RolesService],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RolesController);
  }
}
