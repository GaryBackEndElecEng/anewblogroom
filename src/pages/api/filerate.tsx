import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ratefileType } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const ratefile = req.body as ratefileType;
    if (req.method === "POST") {

        try {
            const rate = await prisma.ratefile.create({
                data: {
                    rate: ratefile.rate as number,
                    fileId: ratefile.fileId
                }
            })

            if (rate) {
                res.status(200).json(rate)
            } else {
                res.status(400).json({ message: "rate was not updated?" })
            }
            await prisma.$disconnect()


        } catch (error) {
            console.error(new Error("Did not recieve rate@post"))
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        try {
            const rates = await prisma.ratefile.findMany();
            if (rates) {
                res.status(200).json(rates)
            } else {
                res.status(400).json({ message: "did not get rates@filerate?" })
            }
        } catch (error) {
            console.error(new Error("did not get files@filerate"))
        } finally {
            await prisma.$disconnect()
        }
    }
}