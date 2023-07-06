import httpStatus from 'http-status';
import createError from 'http-errors';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

import { config } from '../config';
import { logger } from '../lib/logger';

export interface AppError extends Error {
  status: number | string;
  message: string;
  errors?: { [key: string]: string[] };
}

export const handleError = (error: AppError) => {
  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    error = createError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  error.status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
  error.status === httpStatus.INTERNAL_SERVER_ERROR ? logger.error(error) : logger.warn(error);

  // hide internal server error logs in production mode
  if (config.app.isProduction && error.status === httpStatus.INTERNAL_SERVER_ERROR) {
    error.message = 'Internal Server Error';
  }

  return error;
};
