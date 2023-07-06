import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { User } from '@prisma/client';
import createError from 'http-errors';

import { userService } from '../user/user.service';
import { tokenService } from '../token/token.service';

const register = async (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...createdUserWithoutPassword } = await userService.createUser(user);
  return createdUserWithoutPassword;
};

const login = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw createError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const accessToken = await tokenService.generateAccessToken(user);
  const refreshToken = await tokenService.generateRefreshToken(user.id);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: userPassword, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  register,
  login,
};
