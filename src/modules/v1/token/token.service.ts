import { User } from '@prisma/client';

import token from '../../../lib/token';
import { config } from '../../../config';

const generateAccessToken = (user: User) => {
  const { id, roleId, businessId, isEmailVerified, approvalStatus } = user;

  return token.generate({
    payload: { roleId, businessId, isEmailVerified, approvalStatus },
    expiresIn: config.jwt.accessToken.expiresIn,
    audience: 'access',
    subject: id,
  });
};

const generateRefreshToken = (userId: string) => {
  return token.generate({
    expiresIn: config.jwt.refreshToken.expiresIn,
    audience: 'refresh',
    subject: userId,
  });
};

export const tokenService = {
  generateAccessToken,
  generateRefreshToken,
};
