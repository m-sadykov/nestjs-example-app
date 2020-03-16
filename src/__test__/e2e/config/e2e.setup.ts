import { bootstrap } from '../../../main';
import './e2e.config';
import { getMockUsers } from '../../../users/__test__/mock.data';

module.exports = async () => {
  Object.assign(process.env, { NODE_ENV: 'test' });
  (global as any).__APP__ = await bootstrap();

  await getMockUsers();
};
