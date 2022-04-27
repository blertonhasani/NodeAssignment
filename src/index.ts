require('dotenv').config();
const logger = require('./helpers/logging');
const Mongo = require('./configs/mongo');
const app = require('./app');

async function main() {
  await Mongo.connect(process.env.MONGODB_URI);
  app.listen(process.env.PORT, () => {
    logger.info(`Service is listening on port ${process.env.PORT}`);
  });
}

main();
