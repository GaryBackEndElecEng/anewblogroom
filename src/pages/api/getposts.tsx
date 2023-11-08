import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { postType } from "@/lib/Types";
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


    try {

        const posts = await prisma.post.findMany({
            include: {
                likes: true,
                rates: true
            }
        });
        if (posts) {
            const insertPosts: postType[] | undefined = await insertUrlPosts(posts);
            if (insertPosts) {
                res.status(200).json(insertPosts)
                await prisma.$disconnect()
            } else {
                res.status(404).json({ message: "no posts @getposts" })
            }
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
export async function insertUrlPosts(posts: postType[]) {
    if (!posts) return
    const arrPost: postType[] = await Promise.all(
        posts.map(async (post) => await insertUrlPost(post))
    )
    return arrPost

}