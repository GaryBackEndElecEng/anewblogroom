import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { fileType, inputType } from "@lib/Types";
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

export default async function handleFile(req: NextApiRequest, res: NextApiResponse<any>) {
    const input = req.body as inputType;
    const name: string = input.name


    if (input) {

        try {
            const addInput = await prisma.inputType.update({
                where: {
                    id: input.id
                },
                data: {
                    id: input.id,
                    name: input.name,
                    content: input.content,
                    s3Key: input.s3Key,
                    url: input.url,
                    fileId: input.fileId,
                    date: input.date
                },

            });
            // console.log(addInput.id, "recieved", input.id)
            if (addInput) {
                const addUrl = insertInputUrl(addInput)
                res.status(200).json(addUrl)
            } else {
                res.status(400).json({ message: "did not save/update @ addinput" })
            }
        } catch (error) {
            console.error(new Error("try did not pass @ inputUpdatenew"))
        } finally {
            await prisma.$disconnect()
        }
    } else {
        res.status(404).json({ message: "did not recieve input ID for file return" });
    }
    await prisma.$disconnect()

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


