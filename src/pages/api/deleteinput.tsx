import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
import type { fileType, inputType } from "@lib/Types";



export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const input: inputType = req.body as inputType;
    // console.log("input", input)
    if (input) {

        const inputDelete = await prisma.inputType.delete({
            where: {
                id: input.id
            }
        });
        try {
            if (inputDelete) {
                res.status(200).json(inputDelete)

            } else {
                res.status(404).json({ message: `no unit to delete-could not find ${input.id}` })
            }

        } catch (error) {

        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(400).json({ message: `did not delete input component, did not recieve` })
    }
    await prisma.$disconnect();

}
