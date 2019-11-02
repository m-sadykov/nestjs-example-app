import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { DatabaseService } from '../database/database.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';
import { accountsProviders } from './accounts.providers';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AccountsController],
  providers: [AccountsService, DatabaseService, ...accountsProviders],
})
export class AccountsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AccountsController);
  }
}
