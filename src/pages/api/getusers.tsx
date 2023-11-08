import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType, userType, postType } from "@/lib/Types";
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
        const users = await prisma.user.findMany({

        });

        if (users) {
            const body: userType[] | [] = users as userType[]
            const insertS3Img: userType[] = await gets3Users(body)
            res.status(200).json(insertS3Img)

        } else {
            res.status(404).json({ message: "no users found" })
        }
    } catch (error) {
        throw new Error("server error from api/getallFiles()")
    }
}

export async function gets3Users(users: userType[]) {

    const getUsers = await Promise.all(
        users.map(async (user) => {
            return await insertImgUser(user)
        })
    )
    return getUsers

}
export async function insertImgUser(user: userType) {

    if (!user.imgKey) return user
    const params = {
        Key: user.imgKey,
        Bucket
    }
    const command = new GetObjectCommand(params);
    const userimage = await getSignedUrl(s3, command, { expiresIn: 3600 });
    user.image = userimage ? userimage : undefined;
    return user
}