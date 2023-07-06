import jwt from 'jsonwebtoken';

import { config } from '../config';

interface GenerateOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  subject: string;
  audience: string;
  expiresIn: string;
}

interface VerifyOptions {
  token: string;
  audience: string;
}

const generate = ({ payload, subject, audience, expiresIn }: GenerateOptions) => {
  return jwt.sign(payload || {}, config.jwt.secret, {
    expiresIn,
    audience,
    subject,
  });
};

const verify = ({ token, audience }: VerifyOptions) => {
  return jwt.verify(token, config.jwt.secret, {
    algorithms: ['HS256'],
    audience,
  });
};

export default { generate, verify };
