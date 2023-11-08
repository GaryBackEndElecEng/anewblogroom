import type { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType } from "@/lib/Types";
import "@aws-sdk/signature-v4-crt"
import prisma from "@_prisma/client";
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

//------------THIS SEND AN S3 PRESIGNED URL TO THE USER FOR IMAGE UPLOADS  AND INSERTS THE PRESIGNED URL INTO THE IMAGEOBJ----//

export default async function handlerInputMediaReturn(
    req: NextApiRequest,
    res: NextApiResponse
) {
    //NEED THE FILE ID
    const inputID = (req.query.fileID as string)
    const Key: string = (req.query.Key as string)
    // console.log("Getting Key", Key, "Before uploaded")


    try {
        const input = await prisma.inputType.findUnique({
            where: {
                id: parseInt(inputID)
            },
        });
        if (input) {
            const insertInput = await insertInputUrl(input)
            res.status(200).json(insertInput)

        } else {
            res.status(404).json({ message: "input ID not found" })
        }
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }


}
export async function insertInputUrl(input: inputType) {
    if (input.name !== "image" && !input.s3Key) return input;
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: input.s3Key as string,
    };
    const command = new GetObjectCommand(s3Params);
    input.url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return input
}

