import * as mongoose from 'mongoose';

module.exports = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    await (global as any).__APP__.close();
  } catch (exception) {
    console.log('Exception: ', exception);
  }
};
