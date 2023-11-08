"use client";
import React from 'react';
import styles from "@component/posts/posts.module.css";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';
import { likepostType, postType, ratepostType } from '@/lib/Types';
import { GeneralContext } from '../context/GeneralContextProvider';
import { sendPostLike, sendPostRate, sendPostUpdate } from '@/lib/fetchTypes';
import GenStars from "@component/comp/GenStars";
import { reduceAddNewPost } from '@/lib/generalFunc';

//make line of switches for likes and dislikes, then add it to posts=> DO THE SAME FOR POSTS

type mainIconType = {
    id: number,
    name: string,
    icon: React.ReactNode,
    class: string

}
type mainPostLikeType = {
    post: postType,

}
export default function PostRate({ post }: mainPostLikeType) {
    const rateNumArr: number[] = [0, 1, 2, 3, 4, 5]
    const { setPostRates, postRates } = React.useContext(GeneralContext);
    const [rate, setRate] = React.useState<number>(0);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tempPostRate: ratepostType = { rate: rate, postId: post.id as number }
        const updatePostRate = await sendPostRate(tempPostRate);
        if (!updatePostRate) return
        setPostRates([...postRates, updatePostRate])

    }
    return (
        <div className="lg:container mx-auto">
            <div className="flex flex-col items-center justify-center border border-emerald-700 rounded-xl h-[75px] gap-1 mb-0 w-full">
                <form action="" className="w-full p-1  shadow shadow-slate-300 mx-auto flex flex-row gap-4 justify-center items-center bg-slate-500 " onSubmit={handleSubmit}>
                    <select
                        className="p-1 border border-emerald-500 rounded-lg bg-slate-600 text-white"
                        value={String(rate)}
                        onChange={(e) => setRate(parseInt(e.target.value))}
                    >
                        {rateNumArr.map((num: number) => (
                            <React.Fragment key={num + 1}>
                                <option value={num}>{num}</option>
                            </React.Fragment>
                        ))}
                    </select>
                    <button className={styles.buttonsm} type="submit">send</button>
                </form>
                <GenStars rate={rate} />
            </div>

        </div>
    )
}
