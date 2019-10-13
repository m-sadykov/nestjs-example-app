import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { Account } from './interface/account';

@ApiUseTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiResponse({ status: 200, type: [Account] })
  getAll() {
    return this.accountsService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Account })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
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
    return this.accountsService.create(createAccountDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Account has been successfully updated.',
    type: Account,
  })
  updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Account has been successfully removed.',
  })
  removeAccount(@Param('id') id: string) {
    return this.accountsService.delete(id);
  }
}
