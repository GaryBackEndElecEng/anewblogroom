import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";

import { fileType, inputType, userType, userTypeShort } from "@/lib/Types";
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
    const email: string = req.query.email as string;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        if (user) {
            const userFiles = await prisma.file.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    inputTypes: true,
                    likes: true,
                    rates: true
                }
            });

            if (userFiles) {
                const insertFiles = await insertFilesUrls(userFiles);

                res.status(200).json(insertFiles)

            } else {
                const newFile = await prisma.file.create({
                    data: {
                        name: "",
                        title: "",
                        published: false,
                        content: "",
                        userId: user.id,
                        fileUrl: "none",
                        imageKey: null,
                        imageUrl: null,
                    }
                });
                const url = genFileUrl(user as userType, newFile as fileType);
                const updateFile = await prisma.file.update({
                    where: {
                        id: newFile.id
                    },
                    data: {
                        fileUrl: url
                    },
                    include: {
                        inputTypes: true,
                        likes: true,
                        rates: true
                    }
                });
                res.status(200).json(updateFile)
                await prisma.$disconnect()
            }
        } else {
            res.status(400).json({ message: "no user's files" })
        }
    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}

export function genFileUrl(user: userType, file: fileType) {
    if (user && user.name) {
        const username = user.name.replace(" ", "-");
        const url = `/blog/usershomelinks/${username}/${file.id}`
        return url

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
    // const imageUrl = s3.getSignedUrl(
    //     "getObject", s3Params
    // );
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