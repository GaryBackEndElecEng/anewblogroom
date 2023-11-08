import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import { mainPageHit } from "@/lib/Types";
const isProd: boolean = process.env.NODE_ENV == "production" ? true : false;

export default async function handle(req: NextApiRequest, res: NextApiResponse) {



    try {
        const getPage = await prisma.pageHit.findMany()
        const body: mainPageHit[] = getPage as mainPageHit[];
        res.status(200).json(body);
    } catch (error) {
        res.status(500).json({ message: "Issue with page hits on GET" })
    } finally {
        await prisma.$disconnect();
    }


}