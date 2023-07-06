import httpStatus from 'http-status';
import createError from 'http-errors';
import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

interface Options {
  queryString?: boolean;
}

export const validate =
  (schema: ZodSchema, options?: Options) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      //parse the query string if the option is set to true, otherwise parse the body
      if (options?.queryString) {
        req.query = await schema.parseAsync(req.query);
      } else {
        req.body = await schema.parseAsync(req.body);
      }

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          createError(httpStatus.UNPROCESSABLE_ENTITY, 'There are validation errors in your request', {
            errors: err.issues,
          }),
        );
      }
      return next(err);
    }
  };
