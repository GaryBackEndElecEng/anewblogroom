import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "@aws-sdk/signature-v4-crt";

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

export default async function handleTest(req: NextApiRequest, res: NextApiResponse) {
    const fileType: string = req.query.fileType as string;
    const ext = fileType.split("/")[1]
    const Key = `${uuidv4().split("-").slice(0, 1).join()}-test.${ext}`;
    console.log("fileType", fileType, ext)
    const s3Params = {
        Bucket,
        Key,

    }
    const command = new GetObjectCommand(s3Params);
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).json({
        uploadUrl,
        Key
    })
}