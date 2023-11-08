"use client";
import { postType, arrLikeType, userTypeShort, userType } from '@/lib/Types';
import React from 'react';
import Image from 'next/image';
import getFormattedDate from "@lib/getFormattedDate"
import { GeneralContext } from '../context/GeneralContextProvider';
import { getUser } from "@lib/fetchTypes";
import DetailPostUser from "@component/posts/DetailPostUser";
import DetailPostPopup from "@component/posts/DetailPostPopup";

type likeType = {
    name: string,
    count: number
}
type mainDetailType = {
    post: postType | undefined
}

export default function DetailPost({ post }: mainDetailType) {
    const { setUser, user, } = React.useContext(GeneralContext);
    const [rateAvg, setRateAvg] = React.useState<number>(0);
    const [likeCntArr, setLikeCntArr] = React.useState<likeType[]>([]);
    const [popup, setPopup] = React.useState<boolean>(false);

    React.useMemo(async () => {
        if (!post) return
        const getuser = await getUser(post.userId) as userTypeShort as userType;
        if (!getuser) return
        setUser(getuser)
    }, [setUser, post]);

    React.useEffect(() => {
        if (!(post && post.rates)) return
        const len: number = (post.rates && post.rates.length > 0) ? post.rates.length : 1;
        const avgRateRaw = post.rates.reduce((a, b) => (a + b.rate), 0) / (len);
        setRateAvg(Math.ceil(avgRateRaw));
    }, [post, setRateAvg]);

    React.useEffect(() => {
        if (!(post && post.likes)) return

        let arr: likeType[] = [];
        arrLikeType.forEach((like, index) => {
            const likeCount = post.likes.filter(like_ => (like_.name === like.name)).length;
            arr.push({ name: like.name, count: likeCount })
        });
        setLikeCntArr(arr);

    }, [post, setLikeCntArr]);

    return (
        <div className="mx-auto lg:container  my-2 px-1 sm:px-2 flex flex-col justify-center items-center">

            {post &&
                <div className="postcard prose prose-lg prose-invert relative">
                    {popup && <DetailPostPopup setPopup={setPopup} popup={popup} link={post.bloglink} />}
                    {post && post.imageUrl &&
                        <div onClick={() => setPopup(true)}>

                            <Image src={post.imageUrl} alt={post ? post.name : "www.garymasterconnect.com"}
                                width={600}
                                height={600}
                                className="video-aspect cursor-pointer"
                            />
                        </div>
                    }
                    <h3 className="flex flex-col justify-center items-center text-3xl my-2">
                        {post.name}
                    </h3>
                    <p className="mx-auto leading-[1.75rem] px-1 sm:px-2">{post.content}</p>
                    <div className="flex flex-row my-2 gap-4 font-bold">
                        <small className="mx-auto">
                            {post.date && getFormattedDate(post.date)}
                        </small>
                        <small className="mx-auto">
                            {post.name && post.name}
                        </small>
                    </div>
                    <div className="flex flex-col justify-center items-start gap-1 mb-2">
                        <React.Fragment>
                            <h4>Post rates</h4>
                            <div>
                                <span className="text-red-300">Avg Rate:</span>{rateAvg}
                            </div>
                        </React.Fragment>
                        <React.Fragment>
                            <div>
                                <h4>Post likes</h4>
                                <div className="flex flex-row flex-wrap gap-1">
                                    {likeCntArr &&
                                        likeCntArr.map((like, index) => (
                                            <React.Fragment key={index}>
                                                <h5 className="text text-lg text-slate-200">
                                                    {like.name}-{like.count},
                                                </h5>
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                            </div>
                        </React.Fragment>
                    </div>
                    <div className="h-[5px] w-3/4 mb-1 mt-1 bg-slate-400" />
                    <DetailPostUser user={user} />
                    <div className="h-[5px] w-3/4 mt-1 mb-2 bg-slate-400" />
                </div>
            }
        </div>
    )
}
