import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType } from "@/lib/Types";
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

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    try {
        const allFiles = await prisma.file.findMany({
            include: {
                inputTypes: true,
                likes: true,
                rates: true
            }
        });
        if (allFiles) {
            const files: fileType[] = allFiles;
            const getFiles = insertFilesUrls(files)
            res.status(200).json(getFiles)
        } else {
            res.status(404).json({ message: "no files found from getallfiles" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    }
}

export async function insertFilesUrls(files: fileType[]) {
    const fileArr: fileType[] = await Promise.all(
        files.map(async (file: fileType) => {
            return await insertFileUrls(file)
        })
    )
    return fileArr
}
export async function insertFileUrls(file: fileType) {
    // if (!file) return
    let tempFile: fileType = file;
    if (!tempFile.imageKey) return tempFile
    const s3Params = {
        Bucket,
        Key: tempFile.imageKey,
    };

    const command = new GetObjectCommand(s3Params)
    tempFile.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    if (!tempFile.inputTypes || !(tempFile.inputTypes?.length > 0)) return tempFile
    let inputs = tempFile.inputTypes;
    let Arr: inputType[] = [];
    Arr = await insertInputsUrl(inputs as inputType[]);
    tempFile = { ...tempFile, inputTypes: Arr }
    return tempFile
}
export async function insertInputsUrl(inputs: inputType[]) {
    const arr: inputType[] = await Promise.all(
        inputs.map(async (input) => {
            return await insertInputUrl(input)
        })
    )
    return arr
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


