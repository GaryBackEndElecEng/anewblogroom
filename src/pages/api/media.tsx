import type { NextApiRequest, NextApiResponse } from "next";
import type { s3mediaType } from "@/lib/Types";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "@aws-sdk/signature-v4-crt";
import { check } from "@/lib/generalFunc";

const Bucket = process.env.BUCKET_NAME as string
const region = process.env.BUCKET_REGION as string
const accessKeyId = process.env.SDK_ACCESS_KEY as string
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string

export const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }

});

type dataType = {
    name: string
}

//------------THIS SEND AN S3 PRESIGNED URL TO THE USER FOR IMAGE UPLOADS ----//

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const Key: string = (req.query.Key as string)
    const verify = check(Key);
    if (verify) {
        const params = {
            Key,
            Bucket
        }
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        const RetMedia: s3mediaType = { url, Key }

        try {

            res.status(200).json(RetMedia);
        } catch (error) {

        }
    }

}