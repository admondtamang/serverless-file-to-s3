import fs from 'fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { config } from '../../../config';
import { s3Client } from '../../../lib/aws';
import { generateString, getMime } from './S3.helper';

import { IFileUploadResult, IGeneratePresignedUrl, IPutFilesOptions } from './s3.interface';

/**
 * Generates a signed URL for accessing an S3 object.
 * @param {string} key - The file name stored in s3.
 * @returns {Promise<string>} The signed URL.
 */
export const generateSignedURL = async (key: string): Promise<string> => {
  const getObjectParams = {
    Bucket: config.aws.bucket,
    Key: key,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn: 120 });

  return url;
};

/**
 * Generates a presigned URL for uploading a file to an S3 bucket.
 * @param {object} params - The parameters for generating the presigned URL.
 * @param {string} params.bucket - The S3 bucket name.
 * @param {string} params.fileName - The desired file name.
 * @returns {Promise<string>} The presigned URL.
 */
export const generatePresignedUrl = async ({ bucket, fileName }: IGeneratePresignedUrl): Promise<string> => {
  const mime = getMime(fileName);

  const filename = `${await generateString(10)}_${Date.now()}.` + mime;

  const command = new PutObjectCommand({ Bucket: bucket || config.aws.bucket, Key: filename });
  return getSignedUrl(s3Client, command, { expiresIn: 100 });
};

/**
 * Uploads multiple files to an S3 bucket.
 * @param {any[]} files - The array of files to upload.
 * @param {IOptions} [options] - The optional upload options.
 * @returns {Promise<IFileUploadResult[]>} The array of file upload results.
 */
export const putFilesToBucket = async (files: any, options?: IPutFilesOptions): Promise<IFileUploadResult[]> => {
  let path = options?.path;

  const bucketName = options?.bucketName || config.aws.bucket;

  return await Promise.all(
    files.map(async (file: any) => {
      const fileContent = fs.readFileSync(file.path);

      const originalname = file.originalname;
      const mime = getMime(originalname);

      const filename = `${await generateString(10)}_${Date.now()}.` + mime;
      if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

      // path from aws
      const key = path ? `${path}/${filename}` : filename;
      const filePath = `https://${bucketName}.s3.amazonaws.com/${key}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
      });

      await s3Client.send(command);

      return {
        key,
        mime,
        completedUrl: filePath,
        originalFileName: originalname,
        createdAt: new Date(),
      };
    }),
  );
};
