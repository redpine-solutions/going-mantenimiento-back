import { getNodeEnv } from '@envs/vairables';

import winston from 'winston';

const logger = winston.createLogger({
  level: getNodeEnv() === 'production' ? 'error' : 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

// Logger específico para logs de cron exitosos que siempre aparecen en producción
const cronSuccessLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    getNodeEnv() === 'production'
      ? winston.format.json() // JSON format para producción (mejor para parsing)
      : winston.format.combine(winston.format.colorize(), winston.format.simple())
  ),
  transports: [new winston.transports.Console()],
});

export { logger, cronSuccessLogger };
