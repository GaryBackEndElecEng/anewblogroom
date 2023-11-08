import prisma from "@_prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ratepostType } from "@/lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const ratepost = req.body as ratepostType;
    if (req.method === "POST") {

        try {
            const rate = await prisma.ratepost.create({
                data: {
                    rate: ratepost.rate as number,
                    postId: ratepost.postId
                }
            })

            if (rate) {
                res.status(200).json(rate)
            } else {
                res.status(400).json({ message: "rate was not updated@postrate?" })
            }
            await prisma.$disconnect()


        } catch (error) {
            console.error(new Error("Did not recieve rate@postrate"))
        } finally {
            await prisma.$disconnect()
        }
    }
    if (req.method === "GET") {
        try {
            const rates = await prisma.ratepost.findMany();
            if (rates) {
                res.status(200).json(rates)
            } else {
                res.status(400).json({ message: "did not get rates@postrate?" })
            }
        } catch (error) {
            console.error(new Error("did not get rate@postrate"))
        } finally {
            await prisma.$disconnect()
        }
    }
}