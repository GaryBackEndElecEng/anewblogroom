
import React from 'react';
import { fileType, userType } from '@/lib/Types';
import prisma from "@_prisma/client";
import UserBlogItem from "@/components/blog/users/UserBlogItem";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "@aws-sdk/signature-v4-crt";
import { check } from "@lib/generalFunc"

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


const url = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_site : "http://localhost:3000"


export default async function page({ params }: { params: { fileID: string } }) {
    //NOTE YOU CAN NOT FETCH USING AXIOS @SERVER LEVEL
    const fileID = params.fileID;
    const file = await getFileDetail(fileID)



    return (
        <div>

            {file ?

                <UserBlogItem file_={file} />
                :
                <div className="text-center-text-2xl font-bold">Could not find the username</div>

            }
        </div>
    )
}
async function getFileDetail(fileId: string) {
    if (fileId && url) {
        const file = await prisma.file.findUnique({
            where: {
                id: fileId
            },
            include: {
                likes: true,
                rates: true,
                inputTypes: true
            }
        });
        if (file) {
            let tempFile = file as fileType;
            if (tempFile.imageKey && check(tempFile.imageKey)) {
                const params = {
                    Key: tempFile.imageKey,
                    Bucket
                }
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                if (url) tempFile.imageUrl = url;
            }
            const inputs = await Promise.all(
                tempFile.inputTypes.map(async (input) => {
                    if (input.s3Key && check(input.s3Key)) {
                        const params = {
                            Key: input.s3Key,
                            Bucket
                        }
                        const command = new GetObjectCommand(params);
                        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                        if (url) input.url = url;
                    }
                    return input
                })
            );
            return { ...tempFile, inputTypes: inputs }
        }
    }
}
