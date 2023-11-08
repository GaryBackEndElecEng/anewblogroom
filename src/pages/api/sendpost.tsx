import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { insertUrlPost } from "@lib/s3ApiComponents"
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

    const Post = req.body as postType;
    console.log("@SENDPOST", Post)
    try {
        const post = await prisma.post.create({
            data: {
                name: Post.name,
                content: Post.content,
                imageUrl: Post.imageUrl,
                s3Key: Post.s3Key as string,
                userId: Post.userId,
                bloglink: Post.bloglink ? Post.bloglink : null

            }
        })

        if (post) {
            if (post.s3Key) {
                let tempPost = post as postType;
                const params = { Key: post.s3Key as string, Bucket };
                const command = new GetObjectCommand(params);
                tempPost.imageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
                res.status(200).json(tempPost)
            } else {
                res.status(200).json(post)
            }
        } else {
            res.status(400).json({ message: "could not find the post @ sendpost?" })
        }
        await prisma.$disconnect()


    } catch (error) {
        console.error(new Error("Did not recieved query @ getpost"))
    } finally {
        await prisma.$disconnect()
    }
}