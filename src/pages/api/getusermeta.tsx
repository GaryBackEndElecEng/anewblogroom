import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import { userType, userTypeShort } from "@/lib/Types";
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
    const username: string = req.query.username as string;
    const user_name = username.replace("-", " ")
    try {
        const user = await prisma.user.findFirst({
            where: {
                name: user_name
            },

        });
        if (user) {
            // console.log(user[0])//works
            const userWithImage = insertImgUser(user as unknown as userTypeShort)
            res.status(200).json(userWithImage)
            await prisma.$disconnect()
        } else {
            res.status(404).json({ message: "could not find" })
        }

    } catch (error) {

    } finally {
        await prisma.$disconnect()
    }
}

export async function insertImgUser(user: userTypeShort) {

    if (!user.imgKey) return user
    const params = {
        Key: user.imgKey,
        Bucket
    }
    const command = new GetObjectCommand(params);
    const userimage = await getSignedUrl(s3, command, { expiresIn: 3600 });
    user.image = userimage;
    return user
}
