import React from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import type { linkType } from "@lib/Types"
import prisma from "@_prisma/client";

export default async function handleLink(req: NextApiRequest, res: NextApiResponse) {
    const link = req.body as linkType

    if (link) {
        try {
            const getLink = await prisma.link.create({

                data: {
                    url: link.url,
                    subject: link.subject,
                    content: link.content,
                    fileId: link.fileId,
                    inputId: link.inputId
                }
            });
            if (getLink) {
                res.status(200).json(getLink)

            }
            else { res.status(400).json({ message: "could not find" }) }
        } catch (error) {
            res.status(404).json({ message: "did not find link item" })
            console.error(new Error(" did not save"))
        } finally {
            await prisma.$disconnect()
        }
    } else {
        res.status(404).json({ message: "bad request- missing body" })
        await prisma.$disconnect()
    }

}
