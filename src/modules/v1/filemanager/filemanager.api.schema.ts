import { z } from '../../../lib/zod';

export const getPresignedSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
});
