
import { getServerSession } from "next-auth";
import { postType, userAccountType, userType } from "./Types";
import prisma from "@_prisma/client";
import authOptions from "./authOptions";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "@aws-sdk/signature-v4-crt";

const Bucket = process.env.BUCKET_NAME as string
const region = process.env.BUCKET_REGION as string
const accessKeyId = process.env.SDK_ACCESS_KEY as string
const secretAccessKey = process.env.SDK_ACCESS_SECRET as string

export const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }

});

export async function getAccount(): Promise<userAccountType | undefined> {

    const session = await getServerSession(authOptions);
    if (session && session.user?.email) {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });
        try {
            if (user) {
                const userBody: userAccountType = {
                    loaded: true,
                    data: {
                        id: user.id,
                        name: user.name as string,
                        email: user.email as string,
                        image: user.image as string,
                        imgKey: (user.imgKey) ? user.imgKey : undefined,
                        status: "authenticated"
                    }
                }
                return userBody
            }
        } catch (error) {
            throw new Error(" not registered")
        } finally {
            await prisma.$disconnect()
        }
    }
}
//ONLY USE GETSERVERS WITH GEToBJECTcOMMAND()-CONFLICT WITH MAINHEADER
export async function getUser() {
    // "use server";
    const session = await getServerSession(authOptions);
    if (session && session.user?.email) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email
                },
                include: {
                    files: true,
                    posts: true
                }
            });
            if (user) {
                let newUser = user as userType;
                if (newUser.imgKey) {
                    const params = {
                        Key: newUser.imgKey,
                        Bucket
                    }
                    const command = new GetObjectCommand(params);
                    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                    newUser = { ...newUser, image: url }
                }

                return user
            }


        } catch (error) {
            throw new Error(" Did not get user")
        } finally {
            await prisma.$disconnect()
        }
    }
}