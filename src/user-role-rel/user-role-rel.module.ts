import { Module } from '@nestjs/common';
import { UserRoleRelController } from './user-role-rel.controller';
import { UserRoleRelService } from './user-role-rel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodDbService } from '../mongo-db.service';
import { UserRoleRel } from './schema/user-role-rel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserRoleRel', schema: UserRoleRel }]),
  ],
  controllers: [UserRoleRelController],
  providers: [UserRoleRelService, MongodDbService],
})
export class UserRoleRelModule {}
