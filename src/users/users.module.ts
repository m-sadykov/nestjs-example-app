import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongoDbService } from '../mongo-db.service';
import { RoleSchema } from '../roles/schema/role.schema';
import { UserRoleRel } from '../user-role-rel/schema/user-role-rel.schema';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Role',
        schema: RoleSchema,
      },
      {
        name: 'UserRoleRel',
        schema: UserRoleRel,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MongoDbService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
