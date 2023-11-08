import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { insertUrlPost } from "@lib/s3ApiComponents"
import { postType } from "@/lib/Types";
import "@aws-sdk/signature-v4-crt"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const Post = req.body as postType;

    try {
        const post = await prisma.post.update({
            where: {
                id: Post.id
            },
            data: {
                name: Post.name,
                content: Post.content,
                imageUrl: Post.imageUrl,
                s3Key: Post.s3Key,
                userId: Post.userId,
                bloglink: Post.bloglink ? Post.bloglink : null
            },
            include: {
                likes: true,
                rates: true
            }
        })

        if (post) {
            const insertPost = await insertUrlPost(post as postType);
            res.status(200).json(insertPost)
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