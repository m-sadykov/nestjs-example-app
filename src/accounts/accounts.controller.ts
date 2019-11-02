import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
  Inject,
} from '@nestjs/common';
import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountPresentationDto,
} from './dto/account.dto';
import { ApiUseTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';
import { Model } from 'mongoose';
import { Account } from './interface/account';
import { Roles } from '../auth/auth.roles.decorator';
import { Response } from 'express';
import { ACCOUNT_MODEL } from './constants/constants';

@ApiBearerAuth()
@ApiUseTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(ACCOUNT_MODEL) private readonly accountModel: Model<Account>,
    private readonly dbService: DatabaseService,
  ) {}

  @Get()
  @Roles(['admin', 'writer', 'reader'])
  @ApiResponse({ status: 200, type: [AccountPresentationDto] })
  async getAll(): Promise<Account[]> {
    return this.dbService.getAll(this.accountModel);
  }

  @Get(':id')
  @Roles(['admin', 'writer', 'reader'])
  @ApiResponse({ status: 200, type: AccountPresentationDto })
  async findOne(@Param('id') id: string): Promise<Account> {
    return this.dbService.findOne(this.accountModel, id);
  }

  @Post()
  @Roles(['admin', 'writer'])
  @ApiResponse({
    status: 201,
    description: 'Account has been successfully created.',
    type: AccountPresentationDto,
  })
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.dbService.create(this.accountModel, createAccountDto);
  }

  @Patch(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({
    status: 200,
    description: 'Account has been successfully updated.',
    type: AccountPresentationDto,
  })
  async updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.dbService.update(this.accountModel, id, updateAccountDto);
  }

  @Delete(':id')
  @Roles(['admin', 'writer'])
  @ApiResponse({
    status: 200,
    description: 'Account has been successfully removed.',
  })
  async removeAccount(@Param('id') id: string): Promise<Response> {
    return this.dbService.delete(this.accountModel, id);
  }
}
