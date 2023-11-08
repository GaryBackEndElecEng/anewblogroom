import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import { mainPageHit } from "@/lib/Types";
const isProd: boolean = process.env.NODE_ENV == "production" ? true : false;

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const pageHit = req.body as mainPageHit;
    const { page, count, name } = pageHit as mainPageHit;


    if (req.method === "POST") {

        try {

            const getPage = await prisma.pageHit.upsert({
                where: {
                    page: page
                },
                update: {
                    name: name
                },
                create: {
                    page: page,
                    name: name ? name : "none",
                }
            });
            if (!getPage) {
                res.status(400).json({ message: "bad request" })
                return await prisma.$disconnect()
            } else {
                res.status(200).json(getPage)
                await prisma.$disconnect()
            }

        } catch (error) {
            res.status(500).json({ message: "NOT RECORDED" })
        } finally {
            await prisma.$disconnect()
        }

    } else {
        res.status(400).json({ message: "bad request" });

    }


}