import { SESClient } from '@aws-sdk/client-ses';

import { config } from '../../config';

export const ses = new SESClient({
  apiVersion: '2010-12-01',
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    sessionToken: config.aws.sessionToken,
  },
});
