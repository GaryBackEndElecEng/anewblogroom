import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { likefileType } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const likefile = req.body as likefileType;
    if (req.method === "POST") {

        try {
            const like = await prisma.likeblog.create({
                data: {
                    name: likefile.name,
                    fileId: likefile.fileId
                }
            })

            if (like) {
                res.status(200).json(like)
            } else {
                res.status(400).json({ message: "like was not updated?" })
            }
            await prisma.$disconnect()


        } catch (error) {
            console.error(new Error("Did not recieve like@post"))
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        try {
            const likes = await prisma.likeblog.findMany();
            if (likes) {
                res.status(200).json(likes)
            } else {
                res.status(400).json({ message: "did not get@filelike?" })
            }
        } catch (error) {
            console.error(new Error("did not get files@filelike"))
        }
    }
}