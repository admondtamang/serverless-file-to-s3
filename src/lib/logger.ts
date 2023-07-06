import pino from 'pino';
import pinoHttp from 'pino-http';
import httpStatus from 'http-status';

import { config } from '../config';

export const logger = pino({ level: config.logger.level || 'info' });

export const httpLogger = pinoHttp({
  logger: logger,
  serializers: {
    req: (req) => {
      if (config.app.isProduction) {
        return req;
      }
      return;
    },
    res: (res) => {
      if (config.app.isProduction) {
        return res;
      }
      return;
    },
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode} ${httpStatus[res.statusCode]}`;
  },
});
