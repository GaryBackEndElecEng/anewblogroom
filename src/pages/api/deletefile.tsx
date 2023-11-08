import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { fileType } from "@lib/Types";


export default async function handleFile(req: NextApiRequest, res: NextApiResponse) {
    // const session= await getServerSession(authOptions);
    const { fileID } = req.query;



    try {
        const file = await prisma.file.delete({
            where: {
                id: fileID as string,
            }
        });
        if (file) {
            res.status(200).json(file as fileType)
        } else {
            res.status(400).json({ message: `bad request` })
        }
        await prisma.$disconnect();
    } catch (error) {
        res.status(500).json({ message: "server issue at create/add file" })
    }


}



