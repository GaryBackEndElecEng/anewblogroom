import React from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import type { linkType } from "@lib/Types"
import prisma from "@_prisma/client";

export default async function handleLink(req: NextApiRequest, res: NextApiResponse) {

    try {
        const getLink = await prisma.link.findMany();
        if (getLink) {
            res.status(200).json(getLink)
        }
        else { res.status(400).json({ message: "could not find" }) }
        await prisma.$disconnect()

    } catch (error) {
        await prisma.$disconnect()
    }



}
