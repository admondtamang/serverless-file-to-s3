import httpStatus from 'http-status';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

import { sendMail } from '../email/email.service';
import { generatePresignedUrl, generateSignedURL, putFilesToBucket } from '../s3/s3.service';

export const getSignedKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.params.id;
    const data = await generateSignedURL(key);

    return res.json({
      status: 'success',
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPresignedUrlForUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await generatePresignedUrl({ fileName: req.body.fileName });

    return res.json({
      status: 'success',
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
};

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req?.files;

    if (!files) throw createError(httpStatus.CONFLICT, 'Please add files when uploading!');

    const data = await putFilesToBucket(files);

    const emailData = {
      from: 'admond.tamang@webpoint.io',
      to: 'admond.tamang@webpoint.io',
      subject: 'Example Email',
      html: '<b>Hello world?</b>',
      template: 'welcome',
      context: {
        message: 'Files have been successfully uploded?',
      },
    };

    await sendMail(emailData);

    return res.json({
      status: 'success',
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
};
