import express from 'express';

import { upload } from '../../../lib/multer';
import { getPresignedSchema } from './filemanager.api.schema';
import { validate } from '../../../middlewares/validateApiSchema';
import { getSignedKey, getPresignedUrlForUpload, uploadFiles } from './filemanager.controller';

const router = express.Router();

router.post('/', upload.array('files'), uploadFiles);
router.get('/:id', getSignedKey);
router.post('/get-upload-url', validate(getPresignedSchema), getPresignedUrlForUpload);

export default router;
