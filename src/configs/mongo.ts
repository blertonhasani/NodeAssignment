import * as mongoose from 'mongoose';

const logger = require('../helpers/logging');

export class Mongo {
  static connection: mongoose.Mongoose;

  static async connect(connectionString: string): Promise<void> {
    logger.info('Mongo db connecting...');
    try {
      this.connection = await mongoose.connect(connectionString);
    } catch (err) {
      logger.error(`Error Connection to Mongo: ${new Error(err)}`);
    }
    logger.info('Mongo db connected');
    mongoose.connection.on('error', err => {
      logger.error(`Error Connection to Mongo: ${new Error(err)}`);
    });
    mongoose.connection.on('disconnected', () => {
      logger.error('Disconnecting to mongo: ');
    });
    mongoose.connection.on('reconnected', () => {
      logger.error('Reconnect to mongo');
    });
  }

  static getConnection(): mongoose.Mongoose {
    return this.connection;
  }
}
