
import React from 'react'
import MakeAPost from "@component/posts/MakeAPost";
import { getAccount } from '@/lib/nextAuth';
import { getUser_, getPosts } from "@lib/serverGets";
import Login from "@component/comp/Login";
import { userType } from '@/lib/Types';

export default async function page() {
    const getaccount = await getAccount();
    if (getaccount && getaccount.data?.status === "authenticated") {
        const getuser = await getUser_() ? await getUser_() as userType : null;
        const getposts = await getPosts();
        return (
            <div>
                <MakeAPost
                    getAccount={getaccount}
                    getuser={getuser}
                    getposts={getposts}
                />
            </div>
        )
    } else {
        return (
            <div className="grid place-items-center h-screen">
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-center text-3xl mb-3 font-bold">
                        please login to post a message
                    </h3>
                    <Login />
                </div>
            </div>
        )
    }
}
