import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schema/role.schema';
import { RolesController } from './roles.controller';
import { MongodDbService } from '../mongo-db.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }])],
  controllers: [RolesController],
  providers: [MongodDbService],
})
export class RolesModule {}
