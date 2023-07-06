import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

import { nodeMailerTransporter } from '../../../lib/nodemailer';

import { IEmailInterface } from './email.interface';

export const sendMail = (emailData: IEmailInterface) => {
  // handlebars config
  if (emailData.template) {
    const emailTemplate = fs.readFileSync(path.join(__dirname, `./templates/${emailData.template}.hbs`), 'utf8');
    const template = handlebars.compile(emailTemplate);
    emailData.template = emailTemplate;
    emailData.html = template(emailData.context);
  }

  nodeMailerTransporter.sendMail(emailData, (err, info) => {
    if (err) {
      console.log('Error sending email:', err);
    } else {
      console.log('Email sent successfully:', info);
    }
  });
};
