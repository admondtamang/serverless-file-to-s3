import { Request, Response, NextFunction } from 'express';

import { roleService } from './role.service';

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await roleService.getRoles();

    return res.json({
      status: 'success',
      payload: roles,
    });
  } catch (error) {
    return next(error);
  }
};
