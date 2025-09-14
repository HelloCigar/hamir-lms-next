import 'server-only';

import { S3Client } from '@aws-sdk/client-s3'
import { env } from './env'

export const S3 = new S3Client({
    region: env.TIGRIS_REGION,
    endpoint: env.TIGRIS_ENDPOINT_URL_S3,
    forcePathStyle: false,
    credentials: {
        accessKeyId: env.TIGRIS_ACCESS_KEY_ID,
        secretAccessKey: env.TIGRIS_SECRET_ACCESS_KEY
    }
})