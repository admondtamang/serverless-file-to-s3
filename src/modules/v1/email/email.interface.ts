import { Attachment } from 'nodemailer/lib/mailer';

export interface IEmailInterface {
  from: string;
  to: string;
  subject: string;
  context?: Record<string, any>;
  attachments?: Attachment[];
  template?: string;
  html?: string;
}
