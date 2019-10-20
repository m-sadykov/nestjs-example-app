import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

import { AccountsModule } from './accounts/accounts.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    AccountsModule,
    RolesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
