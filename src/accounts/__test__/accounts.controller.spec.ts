import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { AccountsController } from '../accounts.controller';
import { DatabaseService } from '../../database/database.service';
import { AccountSchema } from '../schema/account.schema';
import { ACCOUNT_MODEL } from '../constants/constants';

describe('Accounts Controller', () => {
  let accountsController: AccountsController;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        DatabaseService,
        {
          provide: ACCOUNT_MODEL,
          useValue: AccountSchema,
        },
      ],
    }).compile();

    accountsController = module.get<AccountsController>(AccountsController);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('getAll', () => {
    it('should return list of accounts', async () => {
      const mockAccount = getMockAccount();

      jest
        .spyOn(databaseService, 'getAll')
        .mockImplementationOnce(
          (): any => [mockAccount, mockAccount, mockAccount],
        );

      const accounts = await accountsController.getAll();
      expect(Array.isArray(accounts)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return account by id', async () => {
      const id = 'random_id';
      const mockAccount = getMockAccount();

      jest
        .spyOn(databaseService, 'findOne')
        .mockImplementationOnce((): any => mockAccount);

      const account = await accountsController.findOne(id);
      expect(account).toBe(mockAccount);
    });
  });

  describe('createAccount', () => {
    it('should create account', async () => {
      const mockAccount = getMockAccount();

      jest
        .spyOn(databaseService, 'create')
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
        .spyOn(databaseService, 'update')
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

      jest.spyOn(databaseService, 'delete').mockImplementationOnce(
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
