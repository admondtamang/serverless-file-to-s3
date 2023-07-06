import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import { authService } from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body;

    const registeredUser = await authService.register(user);

    return res.status(httpStatus.CREATED).json({
      status: 'success',
      payload: registeredUser,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.login(email, password);

    return res.json({
      status: 'success',
      payload: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};
