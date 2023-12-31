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

    const getQuery = req.query;
    const { userId, postId } = getQuery;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId as string
            }
        });
        if (user) {
            const post = await prisma.post.findUnique({
                where: {
                    id: parseInt(postId as string)
                },
                include: {
                    rates: true,
                    likes: true
                }
            });
            if (post) {
                const insertPost = await insertUrlPost(post as postType);
                res.setHeader('Cache-Control', 'max-age=14400')
                res.status(200).json(insertPost)
                await prisma.$disconnect()
            } else {
                res.status(404).json({ message: "not found" });
                await prisma.$disconnect();
            }
        } else {
            res.status(404).json({ message: "did not get post@getpost" })
        }

    } catch (error) {
        console.error(new Error("Did not recieved query @ getpost"))
    } finally {
        await prisma.$disconnect()
    }
}
export async function insertUrlPost(post: postType) {
    if (!post.s3Key) return post
    const s3Params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: post.s3Key,
    };
    const command = new GetObjectCommand(s3Params);
    post.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return post

}