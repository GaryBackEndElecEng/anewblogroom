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
    // const session= await getServerSession(authOptions);
    const input = req.body as inputType;
    // console.log(req.body, "INCOMMING", "FILE ID", input)


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
            if (addInput) {

                const addS3Input = await insertInputUrl(addInput);
                res.status(200).json(addS3Input);
            } else {
                res.status(400).json({ message: "did not save/update @ addinput" })
            }
        } catch (error) {
            res.status(500).json({ message: "server error @updateinput" })
        } finally {
            await prisma.$disconnect()
        }
    } else {
        res.status(404).json({ message: "did not recieve input ID @updateinput" });
    }
    await prisma.$disconnect()

}

export async function insertInputUrl(input: inputType) {
    if (input.name !== "image" && !input.s3Key) return input;
    const s3Params = {
        Bucket,
        Key: input.s3Key as string,
    };
    const command = new GetObjectCommand(s3Params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return { ...input, url: url }
}
