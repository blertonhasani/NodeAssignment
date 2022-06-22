import * as winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.splat(), winston.format.errors({ stack: true }), winston.format.json()),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
      level: 'info',
    }),
  ],
});

export { logger };
