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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserPresentationDto } from './dto/user.dto';
import { Roles } from '../auth';
import { IUsersService } from './interfaces/interfaces';
import { USERS_SERVICE } from '../constants';
import { identity } from 'rxjs';
import { ObjectIdValidationPipe } from '../object-id.validation.pipe';

@ApiBasicAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE)
    private readonly usersService: IUsersService,
  ) {}

  @Get()
  @Roles(['admin', 'guest'])
  @ApiResponse({ status: 200, type: [UserPresentationDto] })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({
    summary: 'Get users',
    description: 'Get all existing users',
  })
  @ApiQuery({ name: 'username', required: false })
  async getAll(@Query('query') query?: object): Promise<UserPresentationDto[]> {
    return this.usersService.getAll(query);
  }

  @Get(':id')
  @Roles(['admin', 'guest'])
  @ApiResponse({ status: 200, type: UserPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Get user',
    description: 'Get specific user by id',
  })
  async findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<UserPresentationDto> {
    const result = await this.usersService.findOne(id);
    return result.cata(error => {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }

  @Post()
  @Roles(['admin'])
  @ApiResponse({ status: 201, type: UserPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiConflictResponse({ status: 409, description: 'User already exists' })
  @ApiOperation({
    summary: 'Add new user',
    description: 'Create new user',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserPresentationDto> {
    const result = await this.usersService.addUser(createUserDto);
    return result.cata(error => {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }

  @Patch(':id')
  @Roles(['admin'])
  @ApiResponse({ status: 200, type: UserPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Update user',
    description: 'Update specific user by id',
  })
  async updateUser(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPresentationDto> {
    const result = await this.usersService.updateUser(id, updateUserDto);
    return result.cata(error => {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiResponse({ status: 200, type: UserPresentationDto })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'id: 5e5eb0418aa9340f913008e5',
  })
  @ApiOperation({
    summary: 'Remove user',
    description: 'Delete specific user by id',
  })
  async removeUser(@Param('id', ObjectIdValidationPipe) id: string): Promise<UserPresentationDto> {
    const result = await this.usersService.removeUser(id);
    return result.cata(error => {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: error.name,
        message: error.message,
      });
    }, identity);
  }
}
