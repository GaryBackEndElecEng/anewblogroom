import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import { v4 as uuidv4 } from "uuid";
import { fileType, userType } from "@/lib/Types";


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userID = req.query.userID as string;
    const encode = uuidv4().split("-")[0];
    const encode1 = uuidv4().split("-")[1];
    const s3KeyGen = `${encode}-${"new"}-${encode1}`;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            },
        });

        if (user) {
            const file = await prisma.file.create({
                data: {
                    name: "filename",
                    title: "add a title",
                    published: false,
                    content: "summary content",
                    userId: user.id,
                    imageUrl: null,
                    imageKey: s3KeyGen,
                    fileUrl: "none"
                }
            });
            const mkUrl: string | undefined = genFileUrl(user as userType, file as fileType)
            if (mkUrl) {
                const fileupdate = await prisma.file.update({
                    where: {
                        id: file.id
                    },
                    data: {
                        fileUrl: mkUrl
                    }
                })
                res.status(200).json(fileupdate)
            }
        } else {
            res.status(400).json({ message: "bad request" })
        }
        await prisma.$disconnect()
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    } finally {
        await prisma.$disconnect()
    }

}

export function genFileUrl(user: userType, file: fileType) {
    if (user && user.name) {
        const username = user.name.replace(" ", "-");
        const url = `/blog/usershomelinks/${username}/${file.id}`
        return url

    }
}