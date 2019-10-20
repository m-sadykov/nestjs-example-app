import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './interface/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, type: [User] })
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: User })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    type: User,
    description: 'User has been successfully created.',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    type: User,
    description: 'User has been successfully updated.',
  })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User has bee successfully removed',
  })
  removeUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
