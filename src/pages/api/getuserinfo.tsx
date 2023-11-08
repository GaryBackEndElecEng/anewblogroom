import React from 'react';
import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import { userType } from '@/lib/Types';
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

    const body = req.query;
    const { fileID } = body;

    if (fileID as string) {
        try {
            const file = await prisma.file.findUnique({
                where: {
                    id: fileID as string
                },
            });
            if (file) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: file.userId
                    }
                });
                if (user) {
                    const insertUser = await insertImgUser(user as userType)
                    res.status(200).json(insertUser);
                } else {
                    res.status(400).json({ message: " user not found" })
                }
            }
        } catch (error) {
            console.error(new Error("no fileID-bad request"));
        } finally {
            await prisma.$disconnect();
        }
    }
}
export async function insertImgUser(user: userType) {

    if (!user.imgKey) return user;
    const params = {
        Key: user.imgKey,
        Bucket
    }
    const command = new GetObjectCommand(params);
    const userimage = await getSignedUrl(s3, command, { expiresIn: 3600 });
    user.image = userimage ? userimage : undefined;
    return user
}



