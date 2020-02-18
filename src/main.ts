import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './logging.interceptor';
import { Logger, createLogger, transports, format } from 'winston';
import { AuthGuard } from './auth/auth.guard';
import { UsersService } from './users/users.service';
import { UsersRepository, UsersMapper } from './users/users.repository';
import * as mongoose from 'mongoose';
import { UserSchema, UserDocument } from './users/schema/user.schema';
import { RolesService } from './roles/roles.service';
import { RolesRepository, RolesMapper } from './roles/roles.repository';
import { RoleSchema, RoleDocument } from './roles/schema/role.schema';
import { UserRoleRelService, UserRoleRelationMapper } from './user-role-rel/user-role-rel.service';
import {
  UserRoleRelSchema,
  UserRoleRelDocument,
} from './user-role-rel/schema/user-role-rel.schema';
import { USER_MODEL, ROLE_MODEL, USER_ROLE_RELATION_MODEL } from './constants';
import { authenticate as _authenticate } from './auth/auth.middleware';

const connection = mongoose.connection;

async function bootstrap() {
  const mapper = new UserRoleRelationMapper();
  const userRoleRelModel = connection.model<UserRoleRelDocument>(
    USER_ROLE_RELATION_MODEL,
    UserRoleRelSchema,
    'identity-role-relations',
  );
  const userRoleRelService = new UserRoleRelService(userRoleRelModel, mapper);

  const rolesMapper = new RolesMapper();
  const rolesModel = connection.model<RoleDocument>(ROLE_MODEL, RoleSchema, 'identity-roles');
  const rolesRepository = new RolesRepository(rolesModel, rolesMapper);
  const rolesService = new RolesService(rolesRepository);

  const usersMapper = new UsersMapper();
  const usersModel = connection.model<UserDocument>(USER_MODEL, UserSchema, 'identity-users');
  const usersRepository = new UsersRepository(usersModel, usersMapper);
  const usersService = new UsersService(usersRepository, rolesService, userRoleRelService);

  const authenticate = _authenticate(usersService);

  const app = await NestFactory.create(
    AppModule.forRoot({ usersService, rolesService, userRoleRelService, authenticate }),
  );

  const logger: Logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: { service: 'app-module' },
    transports: [new transports.Console()],
  });

  const reflector = new Reflector();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(reflector));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const options = new DocumentBuilder()
    .setTitle('Nest.js example app')
    .setDescription('Use auto generated admin user credentials to authenticate into swagger')
    .setVersion('1.0')
    .addBearerAuth('Authorization', 'header', 'basic')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Listening on port: ${port}`);
  console.log(`Explore api on http://localhost:${port}/api`);
}
bootstrap();
