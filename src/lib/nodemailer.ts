import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';

import { ses } from './aws';

export const nodeMailerTransporter = nodemailer.createTransport({
  SES: { ses, aws },
});
