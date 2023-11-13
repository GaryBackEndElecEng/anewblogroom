
import React from 'react';
import prisma from "@_prisma/client";
import { fileType, userType } from '@/lib/Types';
import UserHomeBlogItem from "@/components/blog/users/UserHomeBlogItem";
import { Metadata, ResolvingMetadata } from 'next';
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

const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local

export default async function filenamePage({ params }: { params: { fileID: string } }) {
    const fileId = params.fileID as string
    const file: fileType | undefined = await getFileDetail(fileId)


    return (
        <div>
            {fileId ?
                <>
                    <UserHomeBlogItem file_={file} />
                </>
                :
                <div className="text-center-text-2xl font-bold">Could not find the file</div>
            }
        </div>
    )
}

export async function getFileDetail(fileId: string) {
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

type Props = {
    params: { username: string, fileID: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

// export async function generateMetadata(
//     { params }: Props,
//     parent: ResolvingMetadata
// ): Promise<Metadata> {
//     // read route params
//     const username = params.username.replace("-", " ");
//     const fileID = params.fileID

//     // fetch data

//     const res = await fetch(`${url}/api/getfile?fileID=${fileID}`);
//     const file: fileType | undefined = await res.json();
//     const image = (file && file.imageUrl) ? file.imageUrl : "/images/gb_logo.png"
//     // console.log("BODY", body && body.content);//NOT WORKING

//     // optionally access and extend (rather than replace) parent metadata
//     const previousImages = (await parent).openGraph?.images || [];
//     const prevDesc = (await parent).description;
//     const prevDescOP = (await parent).openGraph?.description;

//     return {
//         title: `${username}- Blog Room Page`,
//         description: `${file && file.content},${prevDesc}`,
//         openGraph: {
//             images: [image, ...previousImages],
//             description: `${file && file.content}, ${prevDescOP}`,
//             url: file && file.fileUrl,
//         },
//     }
// }

