import { CorsOptions } from 'cors';

import { env } from './env';

const isProduction = env.NODE_ENV === 'production';

export const config = {
  app: {
    env: env.NODE_ENV,
    isProduction: isProduction,
    port: env.PORT,
  },
  database: {
    postgresql: {
      url: env.POSTGRESQL_URL,
    },
  },
  logger: {
    level: env.LOG_LEVEL,
  },
  bcrypt: {
    saltRounds: 10,
  },
  jwt: {
    secret: env.JWT_SECRET,
    accessToken: {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    },
    refreshToken: {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    },
  },
  aws: {
    bucket: env.BUCKET,
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    sessionToken: env.AWS_SESSION_TOKEN,
  },
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  } as CorsOptions,
};
