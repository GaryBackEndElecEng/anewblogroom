
import React from 'react';

import UserNameBlogs from "@/components/blog/users/UserNameBlogs";
import type { Metadata, ResolvingMetadata } from 'next';
import { userTypeShort } from '@/lib/Types';

// const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local

export default async function userName({ params }: { params: { username: string } }) {
    const { username } = params;
    const decodename = username.replace("-", " ");
    // console.log("DECODEUSERNAME", decodename)WORKS
    //FILES AND POSTS ARE COMPLETE AND USER OWNED
    return (
        <>
            <UserNameBlogs username={username} />
        </>
    )

}

type Props = {
    params: { username: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const username = params.username

    // fetch data
    const user_name = username.replace("-", " ")
    const res = await fetch(`/api/getusermeta?username=${username}`);
    const body: userTypeShort = await res.json();
    const image = (body && body.image) ? body.image : "/images/gb_logo.png"

    // console.log("BIO", body?.bio, body)
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];
    const prevDesc = (await parent).description;
    const prevKwds = (await parent).keywords;
    const bio = (body && body.bio && prevDesc) ? [body.bio, prevDesc].join(": general :") : `${user_name} home blog page where interesting blogs can be found`;


    return {
        title: `${user_name}- Blog Room Page`,
        description: bio,
        authors: [{ name: user_name }, { name: "Gary Wallace" }],
        keywords: prevKwds && [...prevKwds, `${user_name}`, `${user_name} home page`],
        creator: user_name,
        publisher: user_name,
        openGraph: {
            images: [image, ...previousImages],
            description: `${body && body.bio && body.bio} - test here`
        },
    }
}
