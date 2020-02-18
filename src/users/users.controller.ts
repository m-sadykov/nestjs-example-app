import { Controller, Get, Post, Param, Body, Patch, Delete, Inject } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserPresentationDto } from './dto/user.dto';
import { Roles } from '../auth/auth.roles.decorator';
import { IUsersService } from './users.service';
import { USERS_SERVICE } from '../constants';

@ApiBearerAuth()
@ApiUseTags('users')
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
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({
    status: 201,
    type: UserPresentationDto,
    description: 'User has been successfully created.',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserPresentationDto> {
    return this.usersService.addUser(createUserDto);
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
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({
    status: 200,
    description: 'User has bee successfully removed',
  })
  async removeUser(@Param('id') id: string): Promise<UserPresentationDto> {
    return this.usersService.removeUser(id);
  }
}
