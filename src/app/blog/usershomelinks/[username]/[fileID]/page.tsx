
import React from 'react';
import { fileType, userType } from '@/lib/Types';
import UserBlogItem from "@/components/blog/users/UserBlogItem";
import { getFileDetail } from "@lib/serverGets";
import { Metadata, ResolvingMetadata } from 'next';

const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local

export default async function filenamePage({ params }: { params: { fileID: string } }) {

    const file = await getFileDetail(params.fileID as string)


    return (
        <div>
            {file ?
                <>
                    <UserBlogItem file={file} />
                </>
                :
                <div className="text-center-text-2xl font-bold">Could not find the file</div>
            }
        </div>
    )
}

type Props = {
    params: { username: string, fileID: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const username = params.username.replace("-", " ");
    const fileID = params.fileID

    // fetch data

    const res = await fetch(`${url}/api/getfile?fileID=${fileID}`);
    const file: fileType | undefined = await res.json();
    const image = (file && file.imageUrl) ? file.imageUrl : "/images/gb_logo.png"
    // console.log("BODY", body && body.content);//NOT WORKING

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];
    const prevDesc = (await parent).description;
    const prevDescOP = (await parent).openGraph?.description;

    return {
        title: `${username}- Blog Room Page`,
        description: `${file && file.content},${prevDesc}`,
        openGraph: {
            images: [image, ...previousImages],
            description: `${file && file.content}, ${prevDescOP}`,
            url: file && file.fileUrl,
        },
    }
}

