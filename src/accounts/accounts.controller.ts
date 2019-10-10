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
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('accounts')
@Controller('accounts')
export class AccountsController {
  @Get()
  getAll() {
    return 'returns all accounts';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'returns account by id';
  }

  @Post()
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return 'returns created account';
  }

  @Patch()
  updateAccount(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return 'returns updated account';
  }

  @Delete(':id')
  removeAccount(@Param('id') id: string) {
    return 'remove account';
  }
}
