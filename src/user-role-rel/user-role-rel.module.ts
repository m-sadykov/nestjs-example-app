import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserRoleRelController } from './user-role-rel.controller';
import { UserRoleRelService } from './user-role-rel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodDbService } from '../mongo-db.service';
import { UserRoleRel } from './schema/user-role-rel.schema';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserRoleRel', schema: UserRoleRel }]),
    UsersModule,
  ],
  controllers: [UserRoleRelController],
  providers: [UserRoleRelService, MongodDbService],
})
export class UserRoleRelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserRoleRelController);
  }
}
