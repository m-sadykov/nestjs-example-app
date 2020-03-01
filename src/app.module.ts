import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { UserRoleRelModule } from './user-role-rel/user-role-rel.module';
import { IUsersService } from './users/users.service';
import { IRolesService, RolesModule } from './roles';
import { IUserRoleRelService } from './user-role-rel/user-role-rel.service';
import { Authenticate } from './auth/auth.middleware';
import { DatabaseModule } from './database/database.module';

@Module({})
export class AppModule {
  static async forRoot(dependencies: {
    usersService: IUsersService;
    rolesService: IRolesService;
    userRoleRelService: IUserRoleRelService;
    authenticate: Authenticate;
  }): Promise<DynamicModule> {
    return {
      module: AppModule,
      imports: [
        ConfigModule,
        DatabaseModule,
        RolesModule.forRoot(dependencies),
        UsersModule.forRoot(dependencies),
        UserRoleRelModule.forRoot(dependencies),
      ],
    };
  }
}
