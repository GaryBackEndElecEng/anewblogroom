import { dataReplyType } from "@/lib/Types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";


export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    const contact: dataReplyType | undefined = req.body;

    if (contact) {
        const user = await prisma.user.findUnique({
            where: {
                id: contact.userId
            },
        });
        if (user) {
            const storeContact = await prisma.contact.create({
                data: {
                    subject: contact.subject,
                    content: contact.content,
                    userId: user.id,
                    email: (contact.email) ? contact.email : ""
                }
            });
            await prisma.$disconnect()
            res.status(200).json(storeContact);
        } else {
            res.status(400).json({ message: "user not found" })
        }
    } else {
        res.status(404).json({ message: "contact info was not sent" })
    }
    await prisma.$disconnect()
}
//NOTE CREATE EMAIL TO SEND USER AND ADMINISTRATOR (masterultils)