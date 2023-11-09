
import React from 'react';
import { getAllFiles } from "@lib/fetchTypes";
import { fileType, userType } from '@/lib/Types';
import UserBlogItem from "@/components/blog/users/UserBlogItem";
import { getFileDetail } from "@lib/serverGets";

// const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local


export default async function page({ params }: { params: { fileID: string } }) {
    //NOTE YOU CAN NOT FETCH USING AXIOS @SERVER LEVEL
    const fileID = params.fileID;
    const file = await getFileDetail(fileID as string)


    return (
        <div>

            {file ?

                <UserBlogItem file={file} />
                :
                <div className="text-center-text-2xl font-bold">Could not find the username</div>

            }
        </div>
    )
}
