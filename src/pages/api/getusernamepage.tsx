import React from 'react';
import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import type { userTypeShort } from "@lib/Types";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import "@aws-sdk/signature-v4-crt";
import { check } from "@lib/generalFunc"

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
    if (req.method === "GET") {
        const decodebody = req.query.username as string;
        const body = decodebody.replace("-", " ");
        if (body) {
            try {
                const user = await prisma.user.findFirst({
                    where: { name: body },
                    include: {
                        files: true,
                        posts: true
                    },

                });

                if (user) {
                    let tempUser = user as unknown as userTypeShort;
                    if (tempUser.imgKey && check(tempUser.imgKey)) {
                        const params = { Key: tempUser.imgKey, Bucket };
                        const command = new GetObjectCommand(params);
                        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                        if (url) tempUser.image = url;
                    }
                    const newUser = await fillS3Pics(tempUser);
                    return res.status(200).json(newUser)
                }
            } catch (error) {
                return res.status(500).json({ message: "something went wrong @getusernamepage" })
            } finally {
                await prisma.$disconnect()
            }
        }
    }
}

export async function fillS3Pics(user: userTypeShort): Promise<userTypeShort> {
    const fileS3User = await Promise.all(
        user.files.map(async (file) => {
            if (file.imageKey && check(file.imageKey)) {
                const params = { Key: file.imageKey, Bucket };
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                if (url) file.imageUrl = url;
            }
            return file
        })
    );


    const postS3User = await Promise.all(
        user.posts.map(async (post) => {
            if (post.s3Key && check(post.s3Key)) {
                const params = { Key: post.s3Key, Bucket };
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                if (url) post.imageUrl = url;
            }
            return post
        })
    );
    return { ...user, files: fileS3User, posts: postS3User }
}
