import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from '../constants';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (config: ConfigService): Promise<typeof mongoose> => {
      const MONGO_URL = config.get('MONGO_URL');
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      };

      return mongoose.connect(MONGO_URL, options);
    },
    inject: [ConfigService],
  },
];
