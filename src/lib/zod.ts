import { z } from 'zod';

import capitalize from '../utils/capitalize';

const zodErrorMap: z.ZodErrorMap = (error, ctx) => {
  // capitalize the first letter of the field name
  const fieldName = typeof error.path[0] === 'string' ? capitalize(error.path[0]) : error.path[0];

  /* This is where we override the various error codes */
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      if (error.received === 'undefined') {
        return { message: `${fieldName} is required` };
      }
      break;

    case z.ZodIssueCode.too_small:
      if (error.minimum === 1) {
        return { message: `${fieldName} cannot be empty` };
      }
      break;
  }

  // fall back to default message!
  return { message: ctx.defaultError };
};

z.setErrorMap(zodErrorMap);

export { z };
