import cors from 'cors';
import httpStatus from 'http-status';
import createError from 'http-errors';
import express, { Express, NextFunction, Request, Response } from 'express';

import { config } from './config';
import { logger, httpLogger } from './lib/logger';
import { handleError, AppError } from './utils/errorHandler';

import authRoutes from './modules/v1/auth/auth.routes';
import roleRoutes from './modules/v1/role/role.routes';
import fileManagerRoutes from './modules/v1/filemanager/filemanager.routes';

const app: Express = express();
const port = config.app.port || 8080;

app.use(httpLogger);
app.use(cors(config.cors));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server running successfully');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/filemanager', fileManagerRoutes);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(httpStatus.NOT_FOUND, 'Not found'));
});

// Central Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  error = handleError(error);

  return res.status(error.status as number).json({
    status: 'error',
    message: error.message,
    errors: error.errors,
  });
});

app.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at https://localhost:${port}`);
});
