const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.splat(), winston.format.errors({ stack: true }), winston.format.simple()),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
      level: 'info',
    }),
  ],
});

export { logger };
