import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import createError from 'http-errors';
import { User, PrismaClient, Prisma } from '@prisma/client';

import { config } from '../../../config';

const prisma = new PrismaClient();

const createUser = async (user: User) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, Number(config.bcrypt.saltRounds));

    const createdUser = await prisma.user.create({
      data: { ...user, password: hashedPassword },
    });

    return createdUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw createError(httpStatus.CONFLICT, 'User already exists with this email');
    }
    throw error;
  }
};

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

export const userService = {
  createUser,
  getUserByEmail,
};
