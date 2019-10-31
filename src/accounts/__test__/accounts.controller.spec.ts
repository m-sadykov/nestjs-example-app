import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { AccountsController } from '../accounts.controller';
import { AccountsService } from '../accounts.service';
import { MongoDbService } from '../../mongo-db.service';
import { AccountSchema } from '../schema/account.schema';

describe('Accounts Controller', () => {
  let accountsController: AccountsController;
  let mongoDbService: MongoDbService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        MongoDbService,
        {
          provide: getModelToken('Account'),
          useValue: AccountSchema,
        },
      ],
    }).compile();

    accountsController = module.get<AccountsController>(AccountsController);
    mongoDbService = module.get<MongoDbService>(MongoDbService);
  });

  describe('getAll', () => {
    it('should return list of accounts', async () => {
      const mockAccount = getMockAccount();

      jest
        .spyOn(mongoDbService, 'getAll')
        .mockImplementationOnce((): any => mockAccount);

      const account = await accountsController.getAll();
      expect(account).toBe(mockAccount);
    });
  });

  describe('findOne', () => {
    it('should return account by id', async () => {
      const id = 'random_id';
      const mockAccount = getMockAccount();

      jest
        .spyOn(mongoDbService, 'findOne')
        .mockImplementationOnce((): any => mockAccount);

      const account = await accountsController.findOne(id);
      expect(account).toBe(mockAccount);
    });
  });

  describe('createAccount', () => {
    it('should create account', async () => {
      const mockAccount = getMockAccount();

      jest
        .spyOn(mongoDbService, 'create')
        .mockImplementationOnce((): any => mockAccount);

      const createdAccount = await accountsController.createAccount(
        mockAccount,
      );
      expect(createdAccount).toBe(mockAccount);
    });
  });

  describe('updateAccount', () => {
    it('should update account', async () => {
      const id = 'random_id';
      const mockAccount = getMockAccount();

      jest
        .spyOn(mongoDbService, 'update')
        .mockImplementationOnce((): any => mockAccount);

      const updatedAccount = await accountsController.updateAccount(
        id,
        mockAccount,
      );
      expect(updatedAccount).toBe(mockAccount);
    });
  });

  describe('removeAccount', () => {
    it('should remove account by id', async () => {
      const id = 'random_id';

      jest.spyOn(mongoDbService, 'delete').mockImplementationOnce(
        (): any => {
          return {
            statusCode: 200,
            body: {},
          };
        },
      );

      const deletionResult = await accountsController.removeAccount(id);
      expect(deletionResult.statusCode).toBe(200);
    });
  });

  const getMockAccount = () => {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'j.doe@sample.com',
      age: 24,
    };
  };
});
