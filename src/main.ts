import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createLogger, format, Logger, transports } from 'winston';
import { AppModule } from './app.module';
import { authenticate as _authenticate, AuthGuard } from './auth';
import { LoggingInterceptor } from './logging.interceptor';
import { RolesMapper, rolesModel, RolesRepository, RolesService } from './roles';
import { UserRoleRelationMapper, userRoleRelModel, UserRoleRelService } from './user-role-rel';
import { UsersMapper, usersModel, UsersRepository, UsersService } from './users';

export { bootstrap };

async function bootstrap() {
  const mapper = new UserRoleRelationMapper();
  const userRoleRelService = new UserRoleRelService(userRoleRelModel, mapper);

  const rolesMapper = new RolesMapper();
  const rolesRepository = new RolesRepository(rolesModel, rolesMapper);
  const rolesService = new RolesService(rolesRepository);

  const usersMapper = new UsersMapper();
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
    .addBasicAuth()
    .build();

  app.setGlobalPrefix('/api');

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Listening on port: ${port}`);
  console.log(`Explore api on http://localhost:${port}/api`);

  return app;
}

if (require.main === module) {
  bootstrap();
}
