import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from '../src/helpers/logging';

const mongodb = async (): Promise<MongoMemoryServer> => {
  const res = await MongoMemoryServer.create();
  return res;
};

export default class Mongo {
  static connection: mongoose.Mongoose;

  static async connect(): Promise<void> {
    logger.info('Mongo db connecting...');
    try {
      const uri = (await mongodb()).getUri();
      this.connection = await mongoose.connect(uri);
    } catch (err) {
      logger.error(`Error Connection to Mongo: ${new Error(err)}`);
    }
    if (this.connection) {
      logger.info('Mongo db connected');
    }
    mongoose.connection.on('error', err => {
      logger.error(`Error Connection to Mongo: ${new Error(err)}`);
    });
  }

  static async disconnect(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    (await mongodb()).stop();
  }

  static getConnection(): mongoose.Mongoose {
    return this.connection;
  }
}
