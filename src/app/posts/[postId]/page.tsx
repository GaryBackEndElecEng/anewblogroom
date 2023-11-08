
import { postType, userType } from '@/lib/Types';
import axios from 'axios'
import React from 'react';
import DetailPost from "@component/posts/DetailPost";
import { Metadata, ResolvingMetadata } from 'next';
import { getPostDetail } from "@lib/serverGets";

const url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_site : process.env.NEXT_PUBLIC_local

type params = {
    postId: string
}


export default async function postdetail({ params }: { params: { postId: string } }) {
    const postId: number = parseInt(params.postId)
    const post: postType | undefined = await getPostDetail(postId);

    if (post) {
        return (
            <div>
                <DetailPost post={post} />
            </div>
        )
    } else {
        <div className="grid h-[30vh] place-items-center">
            <h3 className="text-center text-3xl"> did not find post</h3>
        </div>
    }
}


type Props = {
    params: { postId: string }
    // searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const { postId } = params

    // fetch data
    const res = await fetch(`${url}/api/postdetail?postId=${postId}`);
    const post: postType | undefined = await res.json();
    if (post && post.bloglink && post.imageUrl) {
        const image = (post && post.imageUrl) ? post.imageUrl : "/images/gb_logo.png";
        let avgRate: number = 0;
        if (post.rates && post.rates.length > 0) {
            const avgRatingRaw = post.rates.reduce((a, b) => (a + b.rate), 0);
            avgRate = Math.ceil(avgRatingRaw) / (post.rates.length);
        }

        // optionally access and extend (rather than replace) parent metadata
        const previousImages = (await parent).openGraph?.images || []
        const prevDesc = (await parent).openGraph?.description;

        const desc = (post && post.content && prevDesc) ? `${[post.content, prevDesc].join(": general;")}` : `${post.name} post description of an author's blog.`;
        const blogUrl = (post && post.bloglink) ? post.bloglink : "#"

        return {
            title: `${post && post.name && post.name}:Rating: ${avgRate}- Blog Room Page`,
            description: desc,

            openGraph: {
                images: [image, ...previousImages],
                url: blogUrl,
            },
        }
    } else {
        return {
            title: ` Blog Room post detail Page`,
            description: "The Blog Room - post detail page",
        }
    }
}