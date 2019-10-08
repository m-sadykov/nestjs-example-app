import { Module } from '@nestjs/common';
import { AccountsController } from './accounts/accounts.controller';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [],
})

export class AppModule {}
