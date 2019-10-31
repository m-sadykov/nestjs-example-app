import { Module } from '@nestjs/common';
import { AccountsController } from '../accounts.controller';
import { AccountsService } from '../accounts.service';
import { MongoDbService } from '../../mongo-db.service';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountsService, MongoDbService],
})
export class MockAcountsModule {}
