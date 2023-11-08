import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@_prisma/client";
import type { userType, fileType, inputType } from "@lib/Types";






export default async function handleFile(req: NextApiRequest, res: NextApiResponse<any>) {
    // const session= await getServerSession(authOptions);
    const input = req.body as inputType;
    // console.log(req.body, "INCOMMING", "FILE ID", input)



    try {
        const addInput = await prisma.inputType.create({
            data: {
                name: input.name,
                content: input.content,
                type: input.type,
                s3Key: input.s3Key,
                url: input.url,
                fileId: input.fileId
            }
        });
        if (addInput) {
            const getFile = await prisma.file.findUnique({
                where: {
                    id: addInput.fileId
                },
                include: {
                    inputTypes: true
                }
            });
            if (getFile) {

                res.status(200).json(getFile)
            }
        } else {
            res.status(400).json({ message: "did not save/update @ addinput" })
        }
    } catch (error) {
        // throw new Error(" did not add input @ addinput")
    } finally {
        await prisma.$disconnect()
    }

}

