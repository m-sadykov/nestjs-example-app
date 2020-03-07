import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Inject,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBasicAuth } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserPresentationDto } from './dto/user.dto';
import { Roles } from '../auth';
import { IUsersService } from './interfaces/interfaces';
import { USERS_SERVICE } from '../constants';
import { identity } from 'rxjs';
import { UserNotFoundError, UserAlreadyExistsError } from './errors/errors';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE)
    private readonly usersService: IUsersService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [UserPresentationDto] })
  async getAll(): Promise<UserPresentationDto[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: UserPresentationDto })
  async findOne(@Param('id') id: string): Promise<UserPresentationDto> {
    const result = await this.usersService.findOne(id);
    return result.cata(error => {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: UserPresentationDto,
    description: 'User has been successfully created.',
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Param() roleId: string,
  ): Promise<UserPresentationDto> {
    const result = await this.usersService.addUser(createUserDto, roleId);
    return result.cata(error => {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    type: UserPresentationDto,
    description: 'User has been successfully updated.',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPresentationDto> {
    const result = await this.usersService.updateUser(id, updateUserDto);
    return result.cata(error => {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'User has bee successfully removed',
  })
  async removeUser(@Param('id') id: string): Promise<UserPresentationDto> {
    const result = await this.usersService.removeUser(id);
    return result.cata(error => {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: error.name,
          message: error.message,
        });
      }
      throw error;
    }, identity);
  }
}
