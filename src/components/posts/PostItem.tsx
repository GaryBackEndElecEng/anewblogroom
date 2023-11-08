"use client";
import Image from 'next/image'
import React from 'react';
import type { postType, userType, userTypeShort } from "@lib/Types";
import styles from "./posts.module.css";
import Link from 'next/link';
import { useRouter } from "next/navigation"
import PostLike from "@/components/posts/PostLike";
import PostRate from "@component/posts/PostRate";
import { getUser } from '@/lib/fetchTypes';
import { GeneralContext } from '../context/GeneralContextProvider';

type mainType = {
    post: postType,
    date: string | undefined,
}

export default function PostItem({ post, date }: mainType) {
    const router = useRouter();
    const { setGetError } = React.useContext(GeneralContext);
    const [user, setUser] = React.useState<userTypeShort | undefined>()

    React.useMemo(async () => {
        if (post) {
            const getuser = await getUser(post.userId)
            if (getuser) {
                setUser(getuser);
            } else {
                setGetError(" getting user failed")
            }
        }
    }, [post, setUser, setGetError]);

    const handleLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        if (!(post && post.bloglink)) return
        router.push(post.bloglink)
    }
    return (

        <div className={`${styles.card} `} >
            <div className={`${styles.cardInset} cursor-pointer`} onClick={(e) => handleLink(e)}>
                {post.imageUrl &&
                    <Image src={post.imageUrl}
                        width={600}
                        height={400}
                        className="aspect-video rounded-inherit"
                        alt={`${post.name}-www.garymasterconnect.com`}
                    />
                }
                <h3 className="text-center my-2 mx-auto text-3xl text-white">{post.name}</h3>

                <div className="flex cursor-pointer">
                    <p className=" my-2 mx-auto text-lg text-slate-100 leading-5 px-1.5">

                        <Image
                            src={(user && user.image) ? user.image : "/images/gb_logo.png"}
                            alt={(user && user.name) ? user.name : "www.garymasterconnect.com"}
                            width={35}
                            height={35}
                            className={styles.userImage}
                        />


                        {post.content}
                    </p>
                </div>



            </div>
            <div className="flex flex-col justify-center items-start">
                <PostLike post={post} />
                <PostRate post={post} />
            </div>
            <div className="flex flex-row text-xs gap-3">
                {date && <small className="font-bold mx-auto">{date}</small>}
                {post.userId && <small className="font-bold mx-auto">{user && user.name}</small>}
            </div>
        </div>

    )
}
