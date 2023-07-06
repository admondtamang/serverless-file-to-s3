import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// validate environment variables to ensure they are available at runtime
const envSchema = z.object({
  PORT: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  NODE_ENV: z.string().optional(),
  JWT_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  POSTGRESQL_URL: z.string().startsWith('postgresql://'),

  BUCKET: z.string().optional(),
  AWS_REGION: z.string().nonempty(),
  AWS_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
  AWS_SESSION_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
