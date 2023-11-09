
import React from 'react'
import AllBlogs from "@component/blog/AllBlogs";
import { fileType, userType } from '@/lib/Types';
import { getGenFiles, getUsers } from "@lib/serverGets";



export default async function page() {
    const get_users: userType[] | undefined = await getUsers()//no file/posts pics;
    const getfiles: fileType[] | [] = await getGenFiles() as fileType[];
    return (
        <>
            <AllBlogs get_users={get_users} getfiles={getfiles} />
        </>

    )
}
