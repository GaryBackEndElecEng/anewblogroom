import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import type { genInfoType } from "@lib/Types";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {

        try {
            const getInfo = await prisma.generalInfo.findMany();

            res.status(200).json(getInfo);
        } catch (error) {
            console.error(new Error("did not get@getgeninfo"))
        } finally {
            await prisma.$disconnect();
        }
    };
    if (req.method === "POST") {
        const geninfo = req.body;

        try {
            const getInfo = await prisma.generalInfo.create({
                data: {
                    ...req.body
                }
            });
            res.status(200).json(getInfo as genInfoType);
        } catch (error) {
            console.error(new Error("did not get@getgeninfo"))
        } finally {
            await prisma.$disconnect();
        }
    };

};