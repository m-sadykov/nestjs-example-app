import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './schema/account.schema';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { MongoDbService } from '../mongo-db.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
    UsersModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService, MongoDbService],
})
export class AccountsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AccountsController);
  }
}
