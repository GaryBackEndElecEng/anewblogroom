import { NextApiRequest, NextApiResponse } from "next";
import type { mediaType, inputType, fileType, postType } from "@/lib/Types";
import prisma from "@_prisma/client";
import { insertUrlPosts } from "@/lib/s3ApiComponents";
import "@aws-sdk/signature-v4-crt"


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userID = req.query.userID as string
    // console.log(userID)
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            }
        });
        if (user) {
            const posts = await prisma.post.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    likes: true,
                    rates: true
                }
            });
            if (posts && posts.length > 0) {

                const retPosts: postType[] | undefined = await insertUrlPosts(posts);
                res.status(200).json(retPosts);
            } else {
                res.status(404).json({ message: "no posts from getuserposts" });
                await prisma.$disconnect()
            }
        } else {
            res.status(404).json({ message: "no user found from getuserposts" })
        }

    } catch (error) {
        throw new Error("server error from api/getuserposts()")
    } finally {
        await prisma.$disconnect()
    }
}

