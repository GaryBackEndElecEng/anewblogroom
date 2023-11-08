import { NextApiRequest, NextApiResponse } from "next";
import type { fileType, inputType, userType } from "@/lib/Types";
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
    const userID = req.query.userID as string
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            }
        });
        if (user) {
            const files = await prisma.file.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    inputTypes: true,
                    rates: true,
                    likes: true
                }
            });
            if (files && files.length > 0) {
                let arr: fileType[] = await insertFilesUrls(files)

                res.status(200).json(arr);
                await prisma.$disconnect()


            } else {
                const file = await prisma.file.create({
                    data: {
                        name: "",
                        content: "",
                        title: "",
                        imageUrl: null,
                        imageKey: null,
                        published: false,
                        userId: user.id,
                        fileUrl: "none"

                    }
                });
                if (file) {
                    const url = genFileUrl(user as userType, file as fileType);
                    const updateFile = await prisma.file.update({
                        where: {
                            id: file.id
                        },
                        data: {
                            fileUrl: url
                        }
                    });
                    let arr: fileType[] = [updateFile as fileType]
                    res.status(200).json(arr)
                    await prisma.$disconnect()
                }
            }
        }

    } catch (error) {
        throw new Error("server error from api/getuserfiles()")
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


