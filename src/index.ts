/* eslint-disable import/first */
import * as dotenv from 'dotenv';

dotenv.config();
import { logger } from './helpers/logging';
import { Mongo } from './configs/mongo';
import app from './app';

async function main() {
  await Mongo.connect(process.env.MONGODB_URI);
  app.listen(process.env.PORT, () => {
    logger.info(`Service is listening on port ${process.env.PORT}`);
  });
}

main();
