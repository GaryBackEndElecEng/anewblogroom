import { NextApiRequest, NextApiResponse } from "next";
import type { userType } from "@/lib/Types";
import prisma from "@_prisma/client";
import "@aws-sdk/signature-v4-crt";

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
    const body = req.body as userType
    if (!body) return res.status(400).json({ message: "bad request: missing paramters" });
    const { id, name, email, imgKey, bio, image } = body;
    // console.log(name, id, imgKey, bio)
    try {
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name,
                imgKey,
                bio,
                image
            }
        });
        if (user) {
            const getuser = await insertImgUser(user as userType)
            res.status(200).json(getuser)
        } else {
            res.status(404).json({ message: "no users found" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    } finally {
        await prisma.$disconnect()
    }
}

export async function insertImgUser(user: userType) {

    if (!user.imgKey) return user
    const params = {
        Key: user.imgKey,
        Bucket
    }
    const command = new GetObjectCommand(params);
    const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    user.image = imageUrl ? imageUrl : undefined;
    return user
}