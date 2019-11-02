import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from './constants';
import { ConfigService } from '../../config/config.service';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (config: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(config.get('MONGO_URL'), { useNewUrlParser: true }),
    inject: [ConfigService],
  },
];
