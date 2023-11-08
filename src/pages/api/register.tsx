import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@_prisma/client";
// import {csrf} from "@/csrf";
import type { userType, registerType } from "@lib/Types";


async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const getBody: registerType = req.body;
        const { name, email, password, imgKey } = getBody;
        //----password is hashed at client browser---//
        try {
            const isUser = await prisma.user.upsert({
                where: {
                    email: email
                },
                update: {},
                create: {
                    name: name,
                    email: email,
                    password: password,
                    imgKey: imgKey ? imgKey : null
                },
                include: {
                    files: true
                }
            });
            if (isUser) {
                res.status(200).json(isUser);
                prisma.$disconnect();
            } else {
                res.status(400).json({ message: " email or user does not exists from register" });

            }
            prisma.$disconnect()
        } catch (error) {
            res.status(500).json({ message: " server error from register" })
        }
    }
}
// export default csrf(handler)
export default handler