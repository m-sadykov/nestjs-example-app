import {
  Inject,
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';
import { Model } from 'mongoose';
import { User } from './interface/user';
import {
  CreateUserDto,
  UpdateUserDto,
  UserPresentationDto,
} from './dto/user.dto';
import { Roles } from '../auth/auth.roles.decorator';
import { UsersService } from './users.service';
import { USER_MODEL } from './constants/constants';
import { Response } from 'express';

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_MODEL)
    private readonly userModel: Model<User>,
    private readonly dbService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: [UserPresentationDto] })
  async getAll(): Promise<User[]> {
    return this.dbService.getAll(this.userModel);
  }

  @Get(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({ status: 200, type: UserPresentationDto })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.dbService.findOne(this.userModel, id);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: UserPresentationDto,
    description: 'User has been successfully created.',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;
    const isUserExists = await this.usersService.isUserAlreadyExists(username);

    if (isUserExists) {
      throw new BadRequestException(`User ${username} already exists`);
    }

    return this.dbService.create(this.userModel, createUserDto);
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
  ): Promise<User> {
    return this.dbService.update(this.userModel, id, updateUserDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'User has bee successfully removed',
  })
  async removeUser(@Param('id') id: string): Promise<Response> {
    return this.dbService.delete(this.userModel, id);
  }
}
