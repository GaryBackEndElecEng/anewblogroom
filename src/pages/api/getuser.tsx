import { NextApiRequest, NextApiResponse } from "next";
import type { userType, userTypeShort } from "@/lib/Types";
import prisma from "@_prisma/client";
import "@aws-sdk/signature-v4-crt"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    const userId = req.query.userId
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId as string
            },

        });
        if (user) {

            const userInsertImg = await insertImgUser(user as userType)
            res.setHeader('Cache-Control', 'max-age=14400')
            res.status(200).json(userInsertImg)
        } else {
            res.status(404).json({ message: "no user found@getuser" })
        }
    } catch (error) {
        throw new Error("server error from api/getuser()")
    } finally {
        await prisma.$disconnect();
    }
}

export async function insertImgUser(user: userType): Promise<userTypeShort> {
    let tempUser: userTypeShort = user as userTypeShort;

    if (!tempUser.imgKey) return tempUser
    const params = {
        Key: tempUser.imgKey,
        Bucket
    }
    const command = new GetObjectCommand(params);
    const imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
    tempUser.image = imageUrl ? imageUrl : undefined;
    return tempUser
}