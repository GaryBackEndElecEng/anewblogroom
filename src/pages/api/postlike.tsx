import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { likepostType } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const postlike = req.body as likepostType;
    if (req.method === "POST") {

        try {
            const like = await prisma.likepost.create({
                data: {
                    name: postlike.name,
                    postId: postlike.postId
                }
            })

            if (like) {
                res.status(200).json(like)
            } else {
                res.status(400).json({ message: "like was not updated@postlike?" })
            }
            await prisma.$disconnect()


        } catch (error) {
            console.error(new Error("Did not recieve like@postlike"))
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        try {
            const likes = await prisma.likepost.findMany();
            if (likes) {
                res.status(200).json(likes)
            } else {
                res.status(400).json({ message: "did not get@filelike?" })
            }
        } catch (error) {
            console.error(new Error("did not get files@filelike"))
        } finally {
            await prisma.$disconnect()
        }
    }
}