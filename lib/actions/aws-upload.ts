"use server";

import {AWS_BUCKET_NAME,AWS_REGION} from "@/lib/constants"

import AWS from "aws-sdk";

// Configure AWS S3
const s3 = new AWS.S3({
  region: AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function generateS3UploadUrl(images:File[]) {

  const result = images.map(async (image) => {
    const s3Param = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${image.name}`, // File path in the bucket
      Expires: 60, // Expiry time (in seconds)
      ContentType: image.type, // File type (e.g., image/jpeg)
      ACL: "public-read", // File access permissions
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", s3Param);

    return {
      file: image,
      signedUrl,
      Key: s3Param.Key,
    };
  });

  return result;
}


