import { Module } from '@nestjs/common';
import { AccountsController } from './accounts/accounts.controller';
import { RolesController } from './roles/roles.controller';

@Module({
  imports: [],
  controllers: [AccountsController, RolesController],
  providers: [],
})

export class AppModule {}
