import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

export default function Connect() {
  return new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT_URL,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });
}

export const bucketName = process.env.S3_BUCKET_NAME;
