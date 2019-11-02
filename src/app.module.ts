import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { AccountsModule } from './accounts/accounts.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { UserRoleRelModule } from './user-role-rel/user-role-rel.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule,
    AccountsModule,
    RolesModule,
    UsersModule,
    UserRoleRelModule,
    // DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
