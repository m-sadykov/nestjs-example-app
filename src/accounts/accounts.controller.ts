import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { MongodDbService } from '../mongo-db.service';
import { Model } from 'mongoose';
import { Account } from './interface/account';

@ApiUseTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>,
    private readonly dbService: MongodDbService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: [Account] })
  async getAll(): Promise<Account[]> {
    return this.dbService.getAll(this.accountModel);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Account })
  async findOne(@Param('id') id: string): Promise<Account> {
    return this.dbService.findOne(this.accountModel, id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Account has been successfully created.',
    type: Account,
  })
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.dbService.create(this.accountModel, createAccountDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Account has been successfully updated.',
    type: Account,
  })
  async updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.dbService.update(this.accountModel, id, updateAccountDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Account has been successfully removed.',
  })
  async removeAccount(@Param('id') id: string): Promise<void> {
    return this.dbService.delete(this.accountModel, id);
  }
}
