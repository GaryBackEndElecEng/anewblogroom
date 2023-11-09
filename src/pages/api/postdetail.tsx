import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { postType } from "@/lib/Types";
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

    const postId = req.query.postId;

    if (postId) {
        const id = parseInt(postId as string)
        try {

            const post = await prisma.post.findUnique({
                where: {
                    id: id
                },
                include: {
                    rates: true,
                    likes: true
                }
            });
            if (post) {
                let tempPost = post;
                if (tempPost.s3Key) {
                    const s3Params = {
                        Bucket,
                        Key: tempPost.s3Key,
                    };
                    const command = new GetObjectCommand(s3Params);
                    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    tempPost.imageUrl = url;
                }
                res.status(200).json(tempPost)

            } else {
                res.status(404).json({ message: "could not find item@postdetail" })
                await prisma.$disconnect()
            }


        } catch (error) {
            console.error(new Error("Did not recieved query @ getpost"))
        } finally {
            await prisma.$disconnect()
        }
    } else {
        res.status(404).json({ message: "no recieved query item from postdetail" })
    }
}
