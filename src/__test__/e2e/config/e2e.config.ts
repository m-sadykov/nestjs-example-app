import { config } from 'dotenv';

config({ path: 'test.env' });
const e2eConfig = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  URL: process.env.URL,
};

export { e2eConfig };
