import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";

import { S3Client, GetObjectCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { userType } from "@/lib/Types";
import { check } from "@lib/generalFunc";
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

    if (req.method === 'GET') {
        try {
            const users = await prisma.user.findMany({
                include: { files: true }
            })
            if (users) {
                let tempUsers = users as userType[]
                const s3Users = await Promise.all(
                    tempUsers.map(async (user) => {
                        if (user.imgKey && check(user.imgKey)) {
                            const params = { Key: user.imgKey, Bucket }
                            const command = new GetObjectCommand(params);
                            try {
                                const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
                                user.image = url;
                            } catch (error) {
                                user.image = undefined
                            }

                        }
                        return user
                    })
                );
                return res.status(200).json(s3Users)
            }
        } catch (error) {
            return res.status(500).json({ error: { message: "server issue@api/users" }, status: 500 })
        } finally {
            await prisma.$disconnect()
        }

    }
}